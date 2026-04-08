import { CommandResult } from './assistantTypes';
import { EmergencyTriage, LanguageSupport } from './triageEngine';
import { LabReportAnalyzer } from './labAnalyzer';
import { PrescriptionScheduler } from './prescriptionScheduler';
import { MedicalKnowledgeEngine } from './medicalKnowledge';
import { AppNavigator } from './appNavigator';
import { getGeneralKnowledgeResponse } from './generalKnowledgeBase';
import { HierarchicalReasoningEngine } from './reasoningEngine';
import { analyzeReportText, formatAnalysisMessage } from './reportAnalysis';

class PersonalTalkHandler {
    GREETING_REGEX = /^\b(hi|hello|hey|howdy|greetings|namaste|hola|bonjour|hallo|salut)\b/i;
    IDENTITY_REGEX = /\b(who are you|your name|what is your name|who is goku)\b/i;
    HELP_REGEX = /\b(help|what can you do|capabilities|assist|can you answer)\b/i;
    FEELING_REGEX = /\b(how are you|how do you feel|how's it going|what's up|doing good|bad day|sad|happy)\b/i;
    JOKE_REGEX = /\b(joke|funny|laugh)\b/i;

    SMALL_TALK: Record<string, string[]> = {
        "how_are_you": [
            "### 🛡️ System Status: 100%\n\nI'm operating at peak efficiency as your clinical strategist! I've been refining your local health data—**how can I help you strengthen your wellness journey today?**",
            "### 🚀 Ready for Deployment\n\nI've just finished a complete system calibration. My medical knowledge banks are fully indexed and ready. What health data should we analyze first?",
            "### 📋 Standing By\n\nSystems are green. I'm ready to assist with report interpretation, medication scheduling, or general health strategy. How are you feeling?"
        ],
        "hello": [
            "### 👋 Greetings, Warrior!\n\nGoku here, your **Clinical Health Strategist**. I'm ready to assist you in mastering your medical data. What's our first objective?",
            "### 🩺 Iam Goku\n\nHello! I'm here to help you navigate your health journey with precision. Are we analyzing a report or checking your medication schedule?",
            "### 🛡️ Secure Connection Established\n\nGreetings. I'm Goku, your private health assistant. No data leaves this device. How can I support your wellness strategy today?"
        ],
        "doing_good": [
            "> **Positive Momentum Detected**\n\nThat's excellent! Maintaining a strong state of mind is a vital pillar of clinical wellness. Let's keep that energy going! 💪",
            "> **Wellness Milestone**\n\nWonderful news. A healthy mind is the foundation for a healthy body. Anything I can do to optimize your current routine?"
        ],
        "bad_day": [
            "### 🛡️ Resilience Protocol Activated\n\nI'm sorry to hear that. Remember: even the strongest warriors have recovery days. Take a moment to breathe. I'm here if you need to review any health metrics to feel more in control. ❤️",
            "### 🩺 Clinical Support Log\n\nTough days are part of the process. Prioritize rest and hydration today. If there's something specific on your mind, I'm here to listen or look up data for you."
        ],
        "jokes": [
            "### 🧪 Laboratory Humour\n\nWhy did the skeleton go to the dance? To have **some-body** to talk to! 💀",
            "### 🏥 Clinical Wit\n\nI told my doctor I broke my arm in two places. He told me to **stop going to those places!** 🏥",
            "### 🧬 Genomic Fun\n\nWhat do you call a fake noodle? **An Impasta!** (Apologies—that one was from my 'Non-Medical' database branch!)"
        ]
    };

    HEALTH_TIPS = [
        "**Strategic Hydration**: Aim for 3.7 liters (men) or 2.7 liters (women) daily to maintain peak cellular function.",
        "**Micro-Recovery**: Take a 5-minute movement break for every 50 minutes of sedentary work to optimize blood flow.",
        "**Nutritional Diversity**: Incorporate 5 different colors of vegetables daily to ensure a broad micronutrient profile.",
        "**Sleep Hygiene**: Prioritize a consistent sleep-wake cycle to regulate cortisol levels and immune response.",
        "**Stress Management**: Practice 'Box Breathing' (4s inhale, 4s hold, 4s exhale, 4s hold) for 2 minutes to reset your nervous system."
    ];

    process(text: string): { action: string, message: string } {
        const lower = text.toLowerCase();

        if (this.JOKE_REGEX.test(lower)) {
            const joke = this.SMALL_TALK.jokes[Math.floor(Math.random() * this.SMALL_TALK.jokes.length)];
            return { action: "TALK", message: joke };
        }

        if (this.FEELING_REGEX.test(lower)) {
            if (lower.includes("how are you")) {
                return { action: "TALK", message: this.SMALL_TALK.how_are_you[Math.floor(Math.random() * this.SMALL_TALK.how_are_you.length)] };
            }
            if (lower.includes("good") || lower.includes("great") || lower.includes("happy")) {
                return { action: "TALK", message: this.SMALL_TALK.doing_good[Math.floor(Math.random() * this.SMALL_TALK.doing_good.length)] };
            }
            if (lower.includes("bad") || lower.includes("sad") || lower.includes("tired")) {
                return { action: "TALK", message: this.SMALL_TALK.bad_day[Math.floor(Math.random() * this.SMALL_TALK.bad_day.length)] };
            }
        }

        if (this.GREETING_REGEX.test(lower)) {
            const greeting = this.SMALL_TALK.hello[Math.floor(Math.random() * this.SMALL_TALK.hello.length)];
            const tip = this.HEALTH_TIPS[Math.floor(Math.random() * this.HEALTH_TIPS.length)];
            return {
                action: "TALK",
                message: `${greeting}\n\n--- \n\n**💡 Daily Health Strategy:** ${tip}`
            };
        }

        if (this.IDENTITY_REGEX.test(lower)) {
            return {
                action: "TALK",
                message: "### 🐉 Identity: Goku (Clinical AI)\n\nI am your **Clinical Health Strategist**. My protocol is to help you analyze, track, and master your medical data with **speed, privacy, and precision**. \n\nI'm optimized for documents, prescriptions, and medical records. How can we optimize your health today?"
            };
        }

        if (this.HELP_REGEX.test(lower)) {
            return {
                action: "TALK",
                message: "### 🛠️ Strategic Capabilities\n\nI am a specialized medical intelligence. I can perform the following operations:\n\n1. **📋 Report Analysis**: Synchronize with lab results to detect anomalies in Hemoglobin, Glucose, and more.\n2. **💊 Pharmacy Sync**: Parse prescriptions and generate an adherence-focused medication schedule.\n3. **🩺 Medical Intelligence**: Query a database of conditions and wellness best-practices.\n4. **🚀 Navigation**: Execute rapid shortcuts to any page (Meds, Reports, Profile).\n\n**Target Objective?** Just ask me to analyze a file or show your schedule!"
            };
        }
        return { action: "NONE", message: "" };
    }
}

export class GokuAssistant {
    labAnalyzer = new LabReportAnalyzer();
    prescriptionScheduler = new PrescriptionScheduler();
    knowledgeEngine = new MedicalKnowledgeEngine();
    navigator = new AppNavigator();
    talkHandler = new PersonalTalkHandler();
    reasoningEngine = new HierarchicalReasoningEngine();
    lastCondition: string | null = null;
    lastFileName: string | null = null;
    lastFileContent: string | null = null;

    processInput(userInput: string): any {
        const lower = userInput.toLowerCase();
        if (lower.replace(/[^a-z0-9]/g, '').length < 2) return { category: "GENERAL_ASSISTANCE", message: "I'm ready! Provide more detail so I can sense what you need." };

        if (this.lastFileContent && ["analyze it", "examine it", "check it"].some(t => lower.includes(t))) return this.analyzeFile(this.lastFileName!, this.lastFileContent!);

        const detectedLang = LanguageSupport.detectLanguage(userInput);
        const emergencyCheck = EmergencyTriage.checkEmergency(userInput);
        if (emergencyCheck.isEmergency) return { type: 'EMERGENCY', content: LanguageSupport.translateResponse(emergencyCheck.message, detectedLang), language: detectedLang };

        const talkResult = this.talkHandler.process(userInput);
        if (talkResult.action === "TALK") return { type: 'TALK', content: LanguageSupport.translateResponse(talkResult.message, detectedLang), language: detectedLang };

        if (["i took", "just took", "mark as taken", "medication"].some(kw => lower.includes(kw))) {
            const currentMeds = this.prescriptionScheduler.getCurrentMedications();
            if (lower.includes("took")) {
                const matchedMed = currentMeds.find((m: any) => lower.includes(m.name.toLowerCase()));
                if (matchedMed) {
                    const updatedMeds = currentMeds.map((m: any) => (m.id === matchedMed.id) ? { ...m, taken: true } : m);
                    localStorage.setItem('userMedications', JSON.stringify(updatedMeds));
                    window.dispatchEvent(new Event('storage'));
                    return { type: 'TALK', content: `Marked **${matchedMed.name}** as taken! 💪`, language: detectedLang };
                }
            }
            if (currentMeds.length > 0) return { type: 'TALK', content: `### Your Schedule\n\n` + currentMeds.map((m: any) => `- **${m.name}** [${m.taken ? '✅' : '🕒'}]`).join('\n'), language: detectedLang };
        }

        const genKnowledge = getGeneralKnowledgeResponse(userInput);
        if (genKnowledge) return { type: 'GENERAL_KNOWLEDGE', content: genKnowledge, language: detectedLang };

        const navResult = this.navigator.processCommand(userInput);
        if (navResult.action === "NAVIGATE") return { type: 'NAVIGATION', content: navResult.message, route: navResult.route, language: detectedLang };

        const responseContent = this._processMedicalContent(userInput);
        if (responseContent.category === "MEDICAL_INFORMATION") this.lastCondition = responseContent.condition;
        return { type: 'MEDICAL_RESPONSE', content: responseContent, language: detectedLang };
    }

    analyzeFile(fileName: string, fileContent: string): any {
        this.lastFileName = fileName;
        this.lastFileContent = fileContent;
        const lower = fileContent.toLowerCase();

        // --- Prescription Logic ---
        if (["prescription", "tablet", "rx", "medicine"].some(kw => lower.includes(kw)) && !lower.includes("report")) {
            const schedule = this.prescriptionScheduler.parsePrescription(fileContent, fileName);
            if (schedule.medication !== "Not specified") {
                const reasoning = this.reasoningEngine.executeReasoning({
                    userQuery: `File: ${fileName}`,
                    clinicalSignals: ["Prescription", schedule.medication],
                    weightings: { "Prescription": 1.5, [schedule.medication]: 1.2 }
                });
                return { type: 'MEDICAL_RESPONSE', content: { category: "PRESCRIPTION_SCHEDULING", message: `${schedule.message}\n\n${reasoning}`, data: schedule } };
            }
        }

        // --- Advanced Clinical Report Analysis ---
        if (["hb", "glucose", "cholesterol", "report", "lab", "analysis", "result", "blood", "test"].some(kw => lower.includes(kw))) {
            // 1. Numerical Analysis
            const labAnalysis = this.labAnalyzer.analyzeReport(fileContent);
            
            // 2. Strategic Narrative Analysis (The 'Doctor' perspective)
            const clinicalStrategicResult = analyzeReportText(fileContent, fileName);
            const narrativeMessage = formatAnalysisMessage(clinicalStrategicResult, fileName);

            // 3. Multimodal Reasoning Fusion
            const reasoning = this.reasoningEngine.executeReasoning({
                userQuery: `File: ${fileName}`,
                clinicalSignals: ["Clinical Report", labAnalysis.condition],
                weightings: { "Report": 1.5, [labAnalysis.condition]: 1.3 }
            });

            // Combine findings for a 'Complete Understanding'
            const integratedMessage = `### 🩺 Complete Clinical Review: ${fileName}\n\n${narrativeMessage}\n\n${reasoning}`;

            return { 
                type: 'MEDICAL_RESPONSE', 
                content: { 
                    category: "LAB_REPORT_ANALYSIS", 
                    message: integratedMessage, 
                    condition: labAnalysis.condition, 
                    data: { ...labAnalysis, strategic: clinicalStrategicResult } 
                } 
            };
        }

        return { type: 'MEDICAL_RESPONSE', content: this._processMedicalContent(fileContent) };
    }

    private _processMedicalContent(text: string): any {
        const lower = text.toLowerCase();
        const knownKeys = this.knowledgeEngine.getAllKnownKeys();

        for (const key of knownKeys) {
            if (lower.includes(key.replace(/_/g, " "))) {
                const info = this.knowledgeEngine.queryUnified(key);
                if (!info) continue;

                const formatted = this.knowledgeEngine.formatKnowledgeResponse(key, info);

                // --- Step 4: Execute MedGemini Reasoning (Heuristic Port) ---
                const reasoningResult = this.reasoningEngine.executeReasoning({
                    userQuery: text,
                    clinicalSignals: [key.toUpperCase()],
                    weightings: { [key.toUpperCase()]: 1.5 }
                });

                return { category: "MEDICAL_INFORMATION", condition: key.toUpperCase(), message: `${formatted}\n\n${reasoningResult}`, data: info };
            }
        }
        return { category: "GENERAL_ASSISTANCE", message: "### 🩺 Clinical Consultation Status\n\nI have monitored your input through my hierarchical reasoning layers. While I'm standing by, I haven't yet detected recognized clinical anomalies or specific medical markers in our current dialogue.\n\n**Next Strategic Step?** You may ask me about a specific condition (e.g., 'Hypertension', 'PCOD') or upload a clinical report for a detailed multimodal scan." };
    }
}

const instance = new GokuAssistant();
export function analyzeFile(fileName: string, fileContent: string): CommandResult { return interpretCommandResponse(instance.analyzeFile(fileName, fileContent)); }
export function interpretCommand(userInput: string): CommandResult { return interpretCommandResponse(instance.processInput(userInput)); }

function interpretCommandResponse(response: any): CommandResult {
    if (response.type === 'GENERAL_KNOWLEDGE') return { type: 'medical', message: response.content };
    if (response.type === 'EMERGENCY' || response.type === 'TALK') return { type: response.type === 'EMERGENCY' ? 'medical' : 'help', message: response.content };
    if (response.type === 'NAVIGATION') return { type: 'navigation', message: response.content, navigationTarget: response.route };

    if (response.type === 'MEDICAL_RESPONSE') {
        const category = response.content.category;
        if (category === 'LAB_REPORT_ANALYSIS' || category === 'PRESCRIPTION_SCHEDULING') return { type: 'medical', message: response.content.message };
        if (category === 'MEDICAL_INFORMATION') return { type: 'medical', message: response.content.message };
    }

    return { type: 'help', message: response.message || response.content?.message || 'How can I assist you with your health?' };
}
