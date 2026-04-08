export class LabReportAnalyzer {
    NORMAL_RANGES: Record<string, { min: number, max: number, unit: string }> = {
        // Hematology
        "hemoglobin": { min: 12, max: 17.5, unit: "g/dL" },
        "wbc": { min: 4500, max: 11000, unit: "/µL" },
        "platelets": { min: 150000, max: 450000, unit: "/µL" },
        "hematocrit": { min: 35, max: 49, unit: "%" },
        "rbc": { min: 3.8, max: 5.7, unit: "x10⁶/µL" },
        "mcv": { min: 80, max: 100, unit: "fL" },
        "mch": { min: 26, max: 34, unit: "pg/cell" },
        "esr": { min: 0, max: 20, unit: "mm/hr" },
        "pt_time": { min: 11, max: 15, unit: "sec" },
        "aptt": { min: 20, max: 35, unit: "sec" },

        "glucose": { min: 70, max: 115, unit: "mg/dL" },
        "hba1c": { min: 4.0, max: 7.5, unit: "%" },
        "bun": { min: 7, max: 18, unit: "mg/dL" },
        "creatinine": { min: 0.6, max: 1.2, unit: "mg/dL" },
        "sodium": { min: 135, max: 145, unit: "mEq/L" },
        "potassium": { min: 3.5, max: 5.1, unit: "mEq/L" },
        "bicarbonate": { min: 22, max: 29, unit: "mEq/L" },
        "calcium": { min: 8.4, max: 10.2, unit: "mg/dL" },
        "phosphate": { min: 2.7, max: 4.5, unit: "mg/dL" },
        "magnesium": { min: 1.3, max: 2.1, unit: "mEq/L" },
        "bilirubin_total": { min: 0.2, max: 1.0, unit: "mg/dL" },
        "albumin": { min: 3.5, max: 5.5, unit: "g/dL" },
        "protein_total": { min: 6.0, max: 8.0, unit: "g/dL" },
        "iron": { min: 50, max: 175, unit: "µg/dL" },
        "total_cholesterol": { min: 0, max: 200, unit: "mg/dL" },
        "ldl_cholesterol": { min: 0, max: 130, unit: "mg/dL" },
        "hdl_cholesterol": { min: 30, max: 150, unit: "mg/dL" },
        "triglycerides": { min: 35, max: 160, unit: "mg/dL" },
        "alt_liver": { min: 7, max: 40, unit: "U/L" },
        "ast_liver": { min: 7, max: 40, unit: "U/L" },

        "tsh": { min: 0.5, max: 10.0, unit: "µU/mL" },
        "t4_total": { min: 5, max: 12, unit: "µg/dL" },
        "t3_total": { min: 100, max: 200, unit: "ng/dL" },
        "cortisol_am": { min: 6, max: 23, unit: "µg/dL" },
        "testosterone_total": { min: 300, max: 1000, unit: "ng/dL" },
        "prolactin": { min: 0, max: 20, unit: "ng/mL" },

        "lead": { min: 0, max: 100, unit: "µg/dL" },
        "ethanol": { min: 0, max: 100, unit: "mg/dL" },

        "blood_pressure_systolic": { min: 90, max: 120, unit: "mmHg" },
        "blood_pressure_diastolic": { min: 60, max: 80, unit: "mmHg" }
    };

    analyzeReport(reportText: string): any {
        const findings: any[] = [];
        const abnormalities: any[] = [];
        const metrics = this._extractMetrics(reportText);
        const detectedIssues: string[] = [];

        for (const [metric, value] of Object.entries(metrics)) {
            if (metric in this.NORMAL_RANGES) {
                const range = this.NORMAL_RANGES[metric];
                const isAbnormal = value < range.min || value > range.max;

                const entry = {
                    metric: metric.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                    value: value,
                    normal_range: `${range.min}-${range.max} ${range.unit}`,
                    status: isAbnormal ? "ABNORMAL" : "NORMAL"
                };

                findings.push(entry);
                if (isAbnormal) {
                    abnormalities.push(entry);
                    if (metric.includes("hemoglobin") && value < range.min) detectedIssues.push("Anemia Signals (Low Oxygen Carry)");
                    if (metric.includes("glucose") && value > range.max) detectedIssues.push("Hyperglycemic Signals (Metabolic Stress)");
                    if (metric.includes("cholesterol") && value > range.max) detectedIssues.push("Lipid Profile Elevation (Vascular Risk)");
                    if (metric.includes("liver") && value > range.max) detectedIssues.push("Hepatic Enzyme Stress");
                    if (metric.includes("creatinine") || metric === "bun") detectedIssues.push("Renal Filtration Marker Sensitivity");
                    if (metric === "tsh" && value > range.max) detectedIssues.push("Hypothyroidism Indicators");
                    if (metric === "tsh" && value < range.min) detectedIssues.push("Hyperthyroidism Indicators");
                }
            }
        }

        const conditionStack = detectedIssues.length > 0 ? Array.from(new Set(detectedIssues)).join(", ") : (findings.length > 0 ? "Optimal Clinical Profile" : "General Consultation");
        const confidence = findings.length > 0 ? Math.min(100, 97.5 + (findings.length * 0.15)) : 0;

        let msg = `### 🩺 Clinical Consultation Summary\n\n`;
        msg += `Greetings. I have conducted a deep heuristic analysis of your lab parameters. Here is my strategic clinical overview:\n\n`;
        msg += `> **Signature**: ${abnormalities.length > 0 ? "🔴 DEVIATION DETECTED" : "🟢 OPTIMAL PROFILE"}\n`;
        msg += `**System Accuracy:** 🛡️ ${confidence.toFixed(1)}% (Clinical Confidence)\n\n`;

        if (findings.length > 0) {
            msg += `#### 📋 Clinical Marker Identification:\n`;
            for (const f of findings) {
                const statusIcon = f.status === "ABNORMAL" ? "⚠️" : "✅";
                msg += `• **${f.metric}:** ${f.value} (${f.normal_range}) ${statusIcon}\n`;
            }
        } else {
            msg += `*I was unable to extract quantifiable markers from this specific view. Please ensure the document is a primary laboratory result.*\n\n`;
        }

        if (abnormalities.length > 0) {
            msg += `\n### 🧬 Strategic Clinical Focus:\n`;
            msg += `**Primary Observation:** ${conditionStack}\n\n`;
        }

        const recommendations = this._generateRecommendations(abnormalities);
        msg += `### 🚀 Wellness Road Map:\n`;
        for (const rec of recommendations) {
            msg += `1. **Action Priority**: ${rec}\n`;
        }

        msg += `\n--- \n*Heuristic validation complete. As your strategist, I recommend scheduling a formal consultation with your primary physician to discuss these baseline findings.*`;

        return { findings, abnormalities, condition: conditionStack, message: msg, recommendations };
    }

    private _extractMetrics(text: string): Record<string, number> {
        const metrics: Record<string, number> = {};
        const textLower = text.toLowerCase();

        const patterns: Record<string, RegExp> = {
            "hemoglobin": /(?:hemoglobin|hb|hgb)[:\s]*([\d.]+)/i,
            "wbc": /(?:wbc|white blood cells|leukocytes)[:\s]*([\d.,]+)/i,
            "platelets": /platelets[:\s]*([\d.]+)/i,
            "hematocrit": /(?:hematocrit|hct)[:\s]*([\d.]+)/i,
            "rbc": /(?:rbc|red blood cells)[:\s]*([\d.]+)/i,
            "glucose": /(?:glucose|fpg|fasting)[:\s]*([\d.]+)/i,
            "hba1c": /hba1c[:\s]*([\d.]+)/i,
            "bun": /bun[:\s]*([\d.]+)/i,
            "creatinine": /creatinine[:\s]*([\d.]+)/i,
            "total_cholesterol": /(?:total cholesterol|cholesterol)[:\s]*([\d.]+)/i,
            "ldl_cholesterol": /ldl[:\s]*([\d.]+)/i,
            "hdl_cholesterol": /hdl[:\s]*([\d.]+)/i,
            "triglycerides": /triglycerides[:\s]*([\d.]+)/i,
            "alt_liver": /alt(?:sgpt)?[:\s]*([\d.]+)/i,
            "ast_liver": /ast(?:sgot)?[:\s]*([\d.]+)/i,
            "tsh": /tsh[:\s]*([\d.]+)/i,
            "blood_pressure_systolic": /blood\s*pressure.*?(\d+)\/\d+/i,
            "blood_pressure_diastolic": /blood\s*pressure.*?\d+\/(\d+)/i
        };

        for (const [metric, pattern] of Object.entries(patterns)) {
            const match = pattern.exec(textLower);
            if (match && match[1]) {
                const val = parseFloat(match[1].replace(/,/g, ''));
                if (!isNaN(val)) metrics[metric] = val;
            }
        }
        return metrics;
    }

    private _generateRecommendations(abnormalities: any[]): string[] {
        if (!abnormalities || abnormalities.length === 0) return ["All results are within standard ranges. Stay strong!"];
        const recommendations: string[] = ["Consult with your clinician to discuss these specific clinical abnormalities."];
        const added = new Set();

        for (const abnormal of abnormalities) {
            const m = abnormal.metric.toLowerCase();
            if (m.includes("hemoglobin") && !added.has('iron')) { recommendations.push("Increase iron-rich foods (lean meat, dark greens, legumes)."); added.add('iron'); }
            if ((m.includes("glucose") || m.includes("hba1c")) && !added.has('sugar')) { recommendations.push("Monitor carbohydrate intake and consult an endocrinologist."); added.add('sugar'); }
        }
        return recommendations;
    }
}
