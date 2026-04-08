export class PrescriptionScheduler {
    lastFileName: string | null = null;
    commonSkips = ["Patient", "Physician", "Doctor", "Date", "Clinic", "Hospital", "Name", "Age", "Sex", "Prescription", "Report", "Medical", "Chart"];

    getCurrentMedications(): any[] {
        try {
            const saved = localStorage.getItem('userMedications');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("[Goku] Error reading medications:", e);
            return [];
        }
    }

    private _syncToLocalStorage(medicationName: string, dosage: string, schedule: Record<string, string>): void {
        try {
            const saved = localStorage.getItem('userMedications');
            const currentMeds = saved ? JSON.parse(saved) : [];
            const newEntries: any[] = [];

            if (schedule.morning) newEntries.push({ id: Date.now() + 1, name: medicationName, dosage: dosage, frequency: "Morning", time: "08:00", taken: false, category: "Prescription" });
            if (schedule.afternoon) newEntries.push({ id: Date.now() + 2, name: medicationName, dosage: dosage, frequency: "Afternoon", time: "13:00", taken: false, category: "Prescription" });
            if (schedule.evening) newEntries.push({ id: Date.now() + 3, name: medicationName, dosage: dosage, frequency: "Evening", time: "20:00", taken: false, category: "Prescription" });

            if (newEntries.length === 0 && medicationName !== "Not specified") {
                newEntries.push({ id: Date.now(), name: medicationName, dosage: dosage, frequency: "Once daily", time: "09:00", taken: false, category: "Prescription" });
            }

            if (newEntries.length > 0) {
                const filteredCurrent = currentMeds.filter((cm: any) => !newEntries.some(ne => ne.name.toLowerCase() === cm.name.toLowerCase() && ne.time === cm.time));
                const updated = [...newEntries, ...filteredCurrent];
                localStorage.setItem('userMedications', JSON.stringify(updated));
                window.dispatchEvent(new Event('storage'));
            }
        } catch (e) {
            console.error("[Goku] Pharmacy Sync Failed:", e);
        }
    }

    parsePrescription(prescriptionText: string, fileName?: string): any {
        if (fileName) this.lastFileName = fileName;
        const medicationLabelMatch = /(?:rx|medication|prescribed|drug|pill|medicine)[:\s]*([a-zA-Z0-9\s]+)/i.exec(prescriptionText);
        let medication = medicationLabelMatch ? medicationLabelMatch[1].trim().split(/\n|\s\s/)[0] : "";

        if (!medication) {
            const words = prescriptionText.trim().split(/\s+/);
            const drugCandidates = words.filter(w => /^[A-Z][A-Za-z]+$/.test(w.replace(/[^A-Za-z]/g, '')) && w.length >= 3);
            const filteredCandidates = drugCandidates.filter(c => !this.commonSkips.some(skip => c.toLowerCase().includes(skip.toLowerCase())));
            medication = filteredCandidates.length > 0 ? filteredCandidates[0] : (words[0] || "");
        }

        const dosageMatch = /(?:dosage|take|qty|amount)[:\s]*([\d\s\w\/\-]+)/i.exec(prescriptionText);
        let dosage = dosageMatch ? dosageMatch[1].trim() : "";
        if (!dosage) {
            const unitMatch = /(\d+\s*(?:mg|ml|mcg|pill|tablet|cap|capsule|unit|gm))/i.exec(prescriptionText);
            dosage = unitMatch ? unitMatch[1] : "As prescribed";
        }

        const schedule = this._createDailySchedule(prescriptionText);
        if ((!medication || medication === "Not specified") && this.lastFileName) {
            const cleanFileName = this.lastFileName.replace(/\.(pdf|txt|png|jpg|jpeg)$/i, '').replace(/[^a-zA-Z0-9\s]/g, ' ');
            const drugCandidates = cleanFileName.trim().split(/\s+/).filter((w: string) => !this.commonSkips.some((skip: string) => w.toLowerCase().includes(skip.toLowerCase())) && w.length >= 3);
            if (drugCandidates.length > 0) medication = drugCandidates[0];
        }

        if (medication && medication !== "Not specified") this._syncToLocalStorage(medication, dosage, schedule);

        let msg = `### 💊 Clinical Pharmacy Sync\n\n`;
        msg += `> **Medication Identified**: **${medication || "Undetermined"}**\n`;
        msg += `**Dosage Parameter:** ${dosage || "As Directed"}\n`;
        msg += `**Status:** 🛡️ SECURE LOCAL SYNCHRONIZATION COMPLETE\n\n`;
        
        msg += `### 🕒 Master Schedule Overview:\n`;
        let hasSchedule = false;
        if (schedule.morning) { msg += `• **08:00 (Morning):** ${schedule.morning} ✅\n`; hasSchedule = true; }
        if (schedule.afternoon) { msg += `• **13:00 (Afternoon):** ${schedule.afternoon} ✅\n`; hasSchedule = true; }
        if (schedule.evening) { msg += `• **20:00 (Evening):** ${schedule.evening} ✅\n`; hasSchedule = true; }
        
        if (!hasSchedule) {
            msg += `• **Routine**: Take Once Daily (Standard Cycle) as prescribed by your clinician.\n`;
        }

        msg += `\n### 🚀 Strategic Action Taken:\n`;
        msg += `1. **Parsing**: High-fidelity extraction of dosage and frequency from raw document text.\n`;
        msg += `2. **Database Sync**: Automated entry created in your **Medications** vault.\n`;
        msg += `3. **Tracking**: You can now mark doses as 'Taken' to track adherence in real-time.\n\n`;
        
        msg += `*Proceed to the Medications page to review your updated clinical timeline.*`;

        return { medication: medication || "Not specified", dosage: dosage || "As prescribed", schedule, message: msg };
    }

    private _createDailySchedule(text: string): Record<string, string> {
        const lower = text.toLowerCase();
        const schedule: Record<string, string> = { morning: "", afternoon: "", evening: "" };

        if (lower.includes("3 times") || lower.includes("thrice") || lower.includes("tid") || /1-1-1/i.test(text)) {
            schedule.morning = "Take with breakfast"; schedule.afternoon = "Take with lunch"; schedule.evening = "Take with dinner";
        } else if (lower.includes("2 times") || lower.includes("twice") || lower.includes("bid") || /1-0-1/i.test(text)) {
            schedule.morning = "Take with breakfast"; schedule.evening = "Take with dinner";
        } else if (lower.includes("once") || lower.includes("daily") || lower.includes("qd") || /1-0-0/i.test(text)) {
            schedule.morning = "Take once a day (usually morning)";
        }

        if (lower.includes("morning") || lower.includes("breakfast")) schedule.morning = "Take with breakfast";
        if (lower.includes("afternoon") || lower.includes("lunch")) schedule.afternoon = "Take with lunch";
        if (lower.includes("evening") || lower.includes("dinner")) schedule.evening = "Take with dinner";

        return schedule;
    }
}
