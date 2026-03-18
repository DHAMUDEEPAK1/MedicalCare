// Response formatter utility for empathetic, human-like medical and general responses

export type ResponseTone = 'informational' | 'urgent' | 'reassuring' | 'general';

// Specialty label map for attribution headers
export const SPECIALTY_LABELS: Record<string, string> = {
  cardiology: '🫀 Cardiology Guidance',
  dermatology: '🩺 Dermatology Insight',
  pediatrics: '👶 Pediatrics Care',
  surgery: '🔪 Surgical Consultation',
  neurology: '🧠 Neurology Insight',
  'general practice': '🏥 General Practice Advice',
  anesthesiology: '💉 Anesthesiology Info',
  oncology: '🎗️ Oncology Guidance',
  gynecology: '🌸 Gynecology Care',
  radiology: '📡 Radiology Interpretation',
};

const MEDICAL_DISCLAIMER =
  '\n\n---\n> ⚕️ *This information is for educational purposes only. Always consult a qualified healthcare professional for diagnosis and personalized treatment.*';

const empatheticOpenings: Record<string, string[]> = {
  concern: [
    "I understand you're concerned about this, and I want to help.",
    "It's completely natural to have questions about this.",
    "I hear you — this is something worth understanding well.",
    "Thank you for reaching out about this.",
  ],
  symptom: [
    "I'm sorry to hear you're experiencing this.",
    "That sounds uncomfortable, and I want to give you some helpful information.",
    "I understand this can be worrying — let me share what I know.",
    "Your health matters, and I'm glad you're looking into this.",
  ],
  general: [
    "Great question!",
    "That's a wonderful thing to be curious about!",
    "I'd be happy to explain that.",
    "Absolutely, let me walk you through this.",
  ],
  urgent: [
    "This is important — please pay close attention.",
    "I want to make sure you have this critical information right away.",
  ],
};

function pickOpening(tone: ResponseTone, index: number = 0): string {
  const key = tone === 'urgent' ? 'urgent' : tone === 'general' ? 'general' : 'concern';
  const options = empatheticOpenings[key];
  return options[index % options.length];
}

export function formatMedicalResponse(
  topic: string,
  content: string,
  tone: ResponseTone = 'informational',
  openingIndex: number = 0,
  specialtyName?: string
): string {
  const opening = pickOpening(tone, openingIndex);

  // Add specialty attribution header if provided
  const specialtyHeader = specialtyName
    ? getSpecialtyHeader(specialtyName)
    : '';

  if (tone === 'urgent') {
    return specialtyHeader
      ? specialtyHeader + '\n\n' + `⚠️ ${opening}\n\n${content}` + MEDICAL_DISCLAIMER
      : `⚠️ ${opening}\n\n${content}` + MEDICAL_DISCLAIMER;
  }

  const body = `${opening}\n\n${content}`;
  return specialtyHeader
    ? specialtyHeader + '\n\n' + body + MEDICAL_DISCLAIMER
    : body + MEDICAL_DISCLAIMER;
}

export function formatGeneralResponse(content: string, _openingIndex: number = 0): string {
  // General knowledge responses are already well-formatted in the knowledge base
  return content;
}

export function addEmpathyToMedicalContent(rawContent: string, topic: string): string {
  // Add a compassionate closing if not already present
  const closings = [
    '\n\nRemember, I\'m here to provide general information. For personalized medical advice, please consult a healthcare professional who knows your full medical history.',
    '\n\nIf you have ongoing concerns or your symptoms persist, please don\'t hesitate to speak with a doctor. Your health is important!',
    '\n\nTake care of yourself, and feel free to ask if you have more questions about this or anything else.',
  ];

  const topicHash = topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const closing = closings[topicHash % closings.length];

  if (!rawContent.includes('healthcare professional') && !rawContent.includes('consult a doctor')) {
    return rawContent + closing;
  }

  return rawContent;
}

export function formatHybridResponse(medicalContent: string, generalContent: string): string {
  return `${medicalContent}\n\n---\n\n**Additional context:**\n\n${generalContent}`;
}

/**
 * Returns a formatted specialty header string for use in responses.
 * @param specialtyName - The name of the specialty (case-insensitive)
 */
export function getSpecialtyHeader(specialtyName: string): string {
  const key = specialtyName.toLowerCase();
  const label = SPECIALTY_LABELS[key];
  if (!label) return '';
  return `## ${label}`;
}

/**
 * Formats a specialty-attributed medical response with header and disclaimer.
 */
export function formatSpecialtyResponse(
  specialtyName: string,
  content: string
): string {
  const header = getSpecialtyHeader(specialtyName);
  const disclaimer =
    '\n\n---\n> ⚕️ *This information is educational. Please consult a qualified ' +
    specialtyName.charAt(0).toUpperCase() +
    specialtyName.slice(1) +
    ' specialist for diagnosis and personalized treatment.*';

  if (header) {
    return header + '\n\n' + content + disclaimer;
  }
  return content + disclaimer;
}
