import { CommandResult, AssistantMessage } from './assistantTypes';
import {
  findMedicalTopic,
  needsClarification,
  generateClarifyingResponse,
  generateMedicalResponse,
} from './medicalKnowledgeBase';
import { getGeneralKnowledgeResponse } from './generalKnowledgeBase';
import { getAllSpecialties } from './specialtyKnowledgeBase';
import { getNotUnderstoodResponse, getHelpText, getGreeting, SupportedLanguage as LegacyLang } from './multilingualResponses';
import { detectLanguage } from './languageDetector';
import { formatMedicalResponse } from './responseFormatter';

// ── Goku's local deterministic AI brain ───────────────────────────────────────
export function interpretCommand(userInput: string, transcript: AssistantMessage[] = []): CommandResult {
  const normalized = userInput.toLowerCase().trim();
  const languageInfo = detectLanguage(userInput);
  const detectedLang = languageInfo.code as LegacyLang;

  // ── 1. Navigation Intelligence ─────────────────────────────────────────────
  const navigationPatterns = [
    { pattern: /\b(go to|open|navigate to|take me to|show|visit)\s+(home|dashboard)\b/i, target: '/home', name: 'Home Dashboard' },
    { pattern: /\b(go to|open|navigate to|take me to|show|visit)\s+(profile|account|settings)\b/i, target: '/profile', name: 'your User Profile' },
    { pattern: /\b(go to|open|navigate to|take me to|show|visit)\s+(sign in|login|signin)\b/i, target: '/signin', name: 'the Sign In portal' },
    { pattern: /\b(go to|open|navigate to|take me to|show|visit)\s+(welcome|start|beginning|main)\b/i, target: '/', name: 'the Welcome screen' },
    { pattern: /\b(go to|open|navigate to|take me to|show|visit)\s+(report|file|document|upload|prescription)\b/i, target: '/report', name: 'Reports & Prescriptions' },
    { pattern: /\b(go to|open|navigate to|take me to|show|visit)\s+(med|medication|pill|alarm|reminder)\b/i, target: '/medications', name: 'Medication Management' },
    { pattern: /\b(go to|open|navigate to|take me to|show|visit)\s+(chat|assistant|goku)\b/i, target: '/chat', name: 'Goku Chat' },
    { pattern: /\b(back to|return to)\s+(home|dashboard)\b/i, target: '/home', name: 'Home Dashboard' },
    { pattern: /\b(back to|return to)\s+(welcome|start)\b/i, target: '/', name: 'Welcome screen' },
  ];

  for (const { pattern, target, name } of navigationPatterns) {
    if (pattern.test(normalized)) {
      return {
        type: 'navigation',
        message: `Certainly! Taking you to **${name}** right now! 💪\n\nIs there anything else I can help you with?`,
        navigationTarget: target,
      };
    }
  }

  // ── 2. Greetings & Identity ────────────────────────────────────────────────
  if (/^(goku|hey goku|hi goku)$/i.test(normalized)) {
    return {
      type: 'help',
      message: `**Yes! I'm Goku — your health warrior companion!** 🐉\n\nI'm ready to help. Ask me about health, medications, symptoms, or say **"help"** to see everything I can do!`,
    };
  }

  if (/^\b(hi|hello|hey|howdy|greetings|namaste|hola|bonjour|hallo|salut)\b/i.test(normalized)) {
    return {
      type: 'help',
      message: getGreeting(detectedLang),
    };
  }

  // ── 3. Help Menu ───────────────────────────────────────────────────────────
  const helpPatterns = [
    /\b(help|what can you do|commands|how do i|assist|capabilities)\b/i,
    /\b(what|how)\b.*\b(work|use|do)\b/i,
  ];
  for (const pattern of helpPatterns) {
    if (pattern.test(normalized)) {
      return {
        type: 'help',
        message: getHelpText(detectedLang),
      };
    }
  }

  // ── 4. Emergency Detection ─────────────────────────────────────────────────
  const emergencyKeywords = [
    'chest pain', 'heart attack', 'stroke', 'can\'t breathe', 'cannot breathe',
    'difficulty breathing', 'unconscious', 'not breathing', 'severe bleeding',
    'call 911', 'emergency', 'suicidal', 'overdose',
  ];
  if (emergencyKeywords.some(kw => normalized.includes(kw))) {
    return {
      type: 'medical',
      message: `🚨 **EMERGENCY DETECTED**\n\n**Call emergency services (911 / 112) IMMEDIATELY!**\n\nDo NOT wait — go to the nearest emergency room or call for help right now.\n\n> ⚕️ *I am an AI assistant and cannot provide emergency medical care. Please contact emergency services immediately.*`,
    };
  }

  // ── 5. Report & Prescription Flow ─────────────────────────────────────────
  const directAnalysisMatch = normalized.match(/(?:uploaded|analyze|read|check|process|plan|explain)\s+(?:a\s+|my\s+)?(?:medical\s+)?(?:report|prescription|file|document)\s+(?:named\s+)?["']?([^"']+)["']?/i);
  if (directAnalysisMatch) {
    const filename = directAnalysisMatch[1];
    return {
      type: 'report-list',
      message: `Searching for your document "${filename}"...`,
      targetFilename: filename,
    };
  }

  if (/analyze my report|read my report|check my result|my medical report|what is in my report/i.test(normalized)) {
    return {
      type: 'report-list',
      message: '📋 **I\'m ready to analyze your health documents!**\n\nI can read your **blood tests, lab reports, and doctor prescriptions**. Just select a file from your list, or say **"paste report"** to type it manually!',
    };
  }

  if (/analyze prescription|read my prescription|medication schedule|create a plan for my meds/i.test(normalized)) {
    return {
      type: 'report-list',
      message: '💊 **I can certainly help you with that!**\n\nIf you upload a photo or PDF of your prescription, I can extract the medications and create a daily morning/afternoon/evening schedule for you.\n\nPlease select the prescription from your files!',
    };
  }

  if (/paste report|enter report manually|type my report/i.test(normalized)) {
    return {
      type: 'report-paste-request',
      message: 'Sure! Please paste the text content from your medical report below and I\'ll analyze it for you immediately. 💪',
    };
  }

  if (/i just uploaded a prescription|create a scheduling plan/i.test(normalized)) {
    return {
      type: 'medical',
      message: `### ✅ Prescription Processed!\n\nI've reviewed your prescription. Based on standard clinical guidelines, here's a suggested schedule:\n\n1. **Take medications as prescribed** — at the same time each day\n2. **With or without food** — follow the label instructions\n3. **Set reminders** — consistency is key for effectiveness!\n\n> 💡 *Always follow your doctor's exact instructions. Consult them before making any changes.*\n\nWould you like to view this on your **Medications** page?`,
      navigationTarget: '/medications',
    };
  }

  // ── 6. General Knowledge Base (health science, wellness, biology) ──────────
  const generalResponse = getGeneralKnowledgeResponse(userInput);
  if (generalResponse) {
    return {
      type: 'medical',
      message: `### 💡 Goku's Insight\n\n${generalResponse}`,
    };
  }

  // ── 7. Medical Knowledge Base (symptoms, conditions, treatments) ───────────
  const medicalTopic = findMedicalTopic(userInput);
  if (medicalTopic) {
    if (needsClarification(userInput, transcript)) {
      return {
        type: 'medical',
        message: `### 🩺 Quick Question\n\n${generateClarifyingResponse(medicalTopic)}\n\n*More details help me give you better information.*`,
      };
    }

    const rawResponse = generateMedicalResponse(medicalTopic);

    // Add red flags warning if applicable
    const redFlagNote = medicalTopic.redFlags && medicalTopic.redFlags.length > 0
      ? `\n\n**⚠️ Seek Immediate Care if you experience:**\n${medicalTopic.redFlags.map(f => `• ${f}`).join('\n')}`
      : '';

    const formattedResponse = formatMedicalResponse(
      medicalTopic.keywords[0] ?? 'health',
      rawResponse + redFlagNote,
      medicalTopic.isEmergency ? 'urgent' : 'informational',
      Math.floor(Math.random() * 3)
    );

    return {
      type: 'medical',
      message: `### 🩺 Medical Information\n\n${formattedResponse}`,
    };
  }

  // ── 8. Specialty Knowledge Base (cardiology, neurology, oncology, etc.) ────
  const specialties = getAllSpecialties();
  for (const spec of specialties) {
    const allTerms = [
      ...spec.keywords,
      ...spec.conditions,
      ...(spec.symptoms ?? []),
      spec.name,
      spec.displayName,
    ];
    if (allTerms.some(term => normalized.includes(term.toLowerCase()))) {
      const redFlagSection = spec.redFlags && spec.redFlags.length > 0
        ? `\n\n**⚠️ Warning Signs — Seek Immediate Care:**\n${spec.redFlags.map(f => `• ${f}`).join('\n')}`
        : '';

      return {
        type: 'medical',
        message: `${spec.content}${redFlagSection}\n\n> 💡 *Would you like more information about ${spec.displayName}?*`,
      };
    }
  }

  // ── 9. Smart Multilingual Fallback ────────────────────────────────────────
  return {
    type: 'unknown',
    message: getNotUnderstoodResponse(detectedLang),
  };
}
