import { specialtyKnowledgeBase } from './specialtyKnowledgeBase';
import { getGeneralKnowledgeResponse } from './generalKnowledgeBase';
import { FUNGAL_DISEASES, INFECTIOUS_AGENTS, FUNGAL_PATHOGENS, CHRONIC_CONDITIONS } from './diseaseKnowledgeBase';
import { medicalKnowledgeBase, findMedicalTopic } from './medicalKnowledgeBase';

export class MedicalKnowledgeEngine {
    SPECIALISTS = specialtyKnowledgeBase;
    FUNGAL_DISEASES = FUNGAL_DISEASES;
    INFECTIOUS_AGENTS = INFECTIOUS_AGENTS;
    FUNGAL_PATHOGENS = FUNGAL_PATHOGENS;
    KNOWLEDGE_BASE = CHRONIC_CONDITIONS;
    LEGACY_BASE = medicalKnowledgeBase;

    getAllKnownKeys(): string[] {
        const keys = new Set<string>();
        Object.keys(this.KNOWLEDGE_BASE).forEach(k => keys.add(k));
        Object.keys(this.FUNGAL_DISEASES).forEach(k => keys.add(k));
        Object.keys(this.INFECTIOUS_AGENTS).forEach(k => keys.add(k));
        Object.keys(this.FUNGAL_PATHOGENS).forEach(k => keys.add(k));
        this.LEGACY_BASE.forEach(topic => topic.keywords.forEach(k => keys.add(k.toLowerCase())));
        Object.values(this.SPECIALISTS).forEach(s => {
            s.conditions.forEach(c => keys.add(c.toLowerCase().replace(/ /g, "_")));
            s.keywords.forEach(k => keys.add(k.toLowerCase().replace(/ /g, "_")));
        });
        return Array.from(keys);
    }

    queryUnified(query: string): any | null {
        const key = query.toLowerCase().replace(/ /g, "_");

        // 1. Direct Chronic Condition Match
        if (this.KNOWLEDGE_BASE[key]) return this.KNOWLEDGE_BASE[key];

        // 2. Fungal Disease Match
        if (this.FUNGAL_DISEASES[key]) {
            const f = this.FUNGAL_DISEASES[key];
            return {
                description: f.overview || f.description,
                symptoms: f.symptoms,
                management: f.treatment,
                red_flags: ["Fever", "Difficulty breathing"]
            };
        }

        // 3. Specialist Cross-Reference
        for (const spec of Object.values(this.SPECIALISTS)) {
            const matchInConditions = spec.conditions.some(c => c.toLowerCase().includes(query.toLowerCase()));
            const matchInKeywords = spec.keywords.some(k => k.toLowerCase() === key || k.toLowerCase() === query.toLowerCase());
            
            if (spec.name.toLowerCase() === key || matchInConditions || matchInKeywords) {
                return {
                    description: `Primary clinical focus: ${spec.displayName}. Managed by ${spec.displayName} specialists.`,
                    symptoms: spec.symptoms,
                    management: spec.treatments,
                    red_flags: spec.redFlags
                };
            }
        }

        // 4. Infectious Agent Match
        if (this.INFECTIOUS_AGENTS[key]) {
            const agent = this.INFECTIOUS_AGENTS[key];
            return {
                description: agent.overview,
                symptoms: Object.keys(agent.examples || {}),
                management: agent.treatment_approaches,
                red_flags: ["Rapid onset", "Severe dehydration", "Respiratory distress"]
            };
        }

        // 5. Check Medical Knowledge Base (Legacy Artifacts)
        const legacyTopic = findMedicalTopic(query);
        if (legacyTopic) {
            return {
                description: legacyTopic.response,
                symptoms: legacyTopic.clarifyingQuestions || [],
                management: ["General Care recommendations applied."],
                red_flags: legacyTopic.redFlags
            };
        }

        // 6. Final Fallback: General Awareness Base
        const generalResponse = this.getGeneralResponse(query);
        if (generalResponse) {
            return {
                description: generalResponse,
                symptoms: ["Consult local clinics for symptom mapping."],
                management: ["Supportive care as indicated."],
                red_flags: ["Follow general emergency guidelines."]
            };
        }

        return null;
    }

    formatKnowledgeResponse(condition: string, details: any): string {
        let msg = `### 🩺 Clinical Intelligence: ${condition.replace(/_/g, " ").toUpperCase()}\n\n`;
        msg += `> **Strategic Overview**: ${details.description}\n\n`;

        if (details.symptoms && details.symptoms.length > 0) {
            msg += `#### 📋 Key Identification Markers (Symptoms):\n`;
            msg += details.symptoms.map((s: string) => `• ${s}`).join("\n") + "\n\n";
        }

        if (details.management && details.management.length > 0) {
            msg += `#### 🚀 Management Protocol:\n`;
            msg += details.management.map((m: string) => `• ${m}`).join("\n") + "\n\n";
        }

        if (details.red_flags && details.red_flags.length > 0) {
            msg += `#### ⚠️ Critical Deviations (Red Flags):\n`;
            msg += details.red_flags.map((rf: string) => `• **${rf}**`).join("\n") + "\n\n";
        }

        msg += `--- \n*Heuristic validation complete. Seek specialist consultation for localized diagnosis.*`;
        return msg;
    }

    getGeneralResponse(input: string): string | null {
        return getGeneralKnowledgeResponse(input);
    }
}
