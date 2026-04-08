export interface EmergencyResponse {
    isEmergency: boolean;
    message: string;
    action: string;
}

export class LanguageSupport {
    static SUPPORTED_LANGUAGES: Record<string, string> = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'hi': 'Hindi',
        'te': 'Telugu'
    };

    static detectLanguage(text: string): string {
        console.log("Detecting language for:", text.slice(0, 10));
        return 'en'; // Fallback
    }

    static translateResponse(text: string, targetLang: string): string {
        if (targetLang === 'en') return text;
        const translations: Record<string, string> = {
            'es': `[ES] ${text}`,
            'fr': `[FR] ${text}`,
            'hi': `[HI] ${text}`,
            'te': `[TE] ${text}`
        };
        return translations[targetLang] || text;
    }
}

export class EmergencyTriage {
    static EMERGENCY_KEYWORDS = [
        "chest pain", "heart attack", "stroke", "can't breathe",
        "difficulty breathing", "severe bleeding", "unconscious",
        "seizure", "allergic reaction", "suicidal", "overdose",
        "severe headache", "high fever", "dehydration", "fracture"
    ];

    static checkEmergency(text: string): EmergencyResponse {
        const textLower = text.toLowerCase();
        const textNoSpaces = textLower.replace(/\s+/g, '');

        if (textLower.includes("heart attack") || textLower.includes("chest pain") ||
            textNoSpaces.includes("heartattack") || textNoSpaces.includes("chestpain")) {
            return {
                isEmergency: true,
                message: "🚨 CRITICAL: POSSIBLE HEART ATTACK DETECTED\n\n**Immediate Actions:**\n1. Call emergency services (911) NOW.\n2. Sit down and stay calm.\n3. Chew an aspirin (325mg) if not allergic.\n4. Do not try to drive yourself to the hospital.\n\n*Symptoms like crushing chest pain, pressure, or radiating pain to the arm/jaw require instant medical intervention!*",
                action: "EMERGENCY_PROTOCOL_CARDIAC"
            };
        }

        if (textLower.includes("stroke") || textLower.includes("facial drooping") ||
            textLower.includes("slurred speech") || textNoSpaces.includes("facialdrooping") ||
            textNoSpaces.includes("slurredspeech")) {
            return {
                isEmergency: true,
                message: "🚨 CRITICAL: POSSIBLE STROKE DETECTED\n\n**Think F.A.S.T:**\n- **F (Face):** Is one side drooping?\n- **A (Arms):** Can they raise both arms?\n- **S (Speech):** Is speech slurred or strange?\n- **T (Time):** Call 911 immediately!\n\n*Time is brain - every minute counts!*",
                action: "EMERGENCY_PROTOCOL_STROKE"
            };
        }

        for (const keyword of EmergencyTriage.EMERGENCY_KEYWORDS) {
            const normalizedKeyword = keyword.toLowerCase();
            const noSpaceKeyword = normalizedKeyword.replace(/\s+/g, '');

            if (textLower.includes(normalizedKeyword) || textNoSpaces.includes(noSpaceKeyword)) {
                return {
                    isEmergency: true,
                    message: "🚨 MEDICAL EMERGENCY DETECTED\n\nPlease call emergency services (911) or go to the nearest emergency room immediately!\n\n**Wait for help and do not consume food or drink until evaluated.** This is not a substitute for professional emergency care.",
                    action: "EMERGENCY_PROTOCOL_ACTIVATED"
                };
            }
        }
        return { isEmergency: false, message: "", action: "" };
    }
}
