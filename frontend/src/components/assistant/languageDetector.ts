// Language detection utility using character analysis and pattern matching
// No external APIs - fully deterministic client-side detection

export type SupportedLanguage =
  | 'en' | 'fr' | 'es' | 'ar' | 'zh' | 'de' | 'it' | 'pt' | 'ru' | 'ja' | 'ko'
  | 'tr' | 'nl' | 'pl' | 'sv' | 'da' | 'fi' | 'no' | 'id' | 'ms' | 'th' | 'vi'
  | 'as' | 'bn' | 'brx' | 'doi' | 'gu' | 'hi' | 'kn' | 'ks' | 'gom' | 'mai'
  | 'ml' | 'mni' | 'mr' | 'ne' | 'or' | 'pa' | 'sa' | 'sat' | 'sd' | 'ta' | 'te' | 'ur';

export interface DetectedLanguage {
  code: SupportedLanguage;
  locale: string; // BCP-47 locale for speech APIs
  name: string;
  confidence: 'high' | 'medium' | 'low';
}

// Character range checks
function hasArabicChars(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

function hasCJKChars(text: string): boolean {
  return /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(text);
}

function hasJapaneseChars(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
}

function hasKoreanChars(text: string): boolean {
  return /[\uAC00-\uD7AF\u1100-\u11FF]/.test(text);
}

function hasCyrillicChars(text: string): boolean {
  return /[\u0400-\u04FF]/.test(text);
}

function hasDevanagariChars(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

function hasThaiChars(text: string): boolean {
  return /[\u0E00-\u0E7F]/.test(text);
}

// Indian Scripts
function hasBengaliChars(text: string): boolean { return /[\u0980-\u09FF]/.test(text); }
function hasGujaratiChars(text: string): boolean { return /[\u0A80-\u0AFF]/.test(text); }
function hasGurmukhiChars(text: string): boolean { return /[\u0A00-\u0A7F]/.test(text); }
function hasOdiaChars(text: string): boolean { return /[\u0B00-\u0B7F]/.test(text); }
function hasTamilChars(text: string): boolean { return /[\u0B80-\u0BFF]/.test(text); }
function hasTeluguChars(text: string): boolean { return /[\u0C00-\u0C7F]/.test(text); }
function hasKannadaChars(text: string): boolean { return /[\u0C80-\u0CFF]/.test(text); }
function hasMalayalamChars(text: string): boolean { return /[\u0D00-\u0D7F]/.test(text); }
function hasUrduChars(text: string): boolean { return /[\u067E\u0686\u0698\u06AF\u06CC\u06D2]/.test(text); }

// Word-based pattern detection for Latin-script languages
const LANGUAGE_PATTERNS: Record<string, { words: string[]; patterns: RegExp[] }> = {
  en: {
    words: ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'am', 'is', 'are', 'was', 'were', 'be', 'being', 'been', 'do', 'does', 'did', 'have', 'has', 'had', 'the', 'a', 'an', 'and', 'but', 'or', 'so', 'if', 'because', 'as', 'until', 'while', 'of', 'in', 'to', 'for', 'with', 'on', 'at', 'from', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among', 'hello', 'hi', 'yes', 'no', 'thanks', 'thank', 'please', 'sorry', 'how', 'what', 'why', 'when', 'where', 'who', 'which', 'health', 'doctor', 'pain', 'disease', 'symptom', 'treatment', 'medicine', 'hospital', 'clinic'],
    patterns: [/\b(i|you|he|she|it|we|they)\b/i, /\b(the|a|an)\b/i, /\b(am|is|are|was|were|be|been)\b/i, /\b(have|has|had)\b/i],
  },
  fr: {
    words: ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'est', 'sont', 'avoir', 'être', 'faire', 'aller', 'bonjour', 'merci', 'oui', 'non', 'comment', 'pourquoi', 'quand', 'où', 'qui', 'que', 'quoi', 'avec', 'pour', 'dans', 'sur', 'par', 'mais', 'ou', 'donc', 'car', 'ni', 'or', 'santé', 'médecin', 'maladie', 'douleur', 'symptôme', 'traitement', 'médicament'],
    patterns: [/\b(je|tu|il|elle|nous|vous|ils|elles)\b/i, /\b(le|la|les|un|une|des)\b/i, /[àâäéèêëîïôùûüç]/i],
  },
  es: {
    words: ['yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas', 'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'y', 'es', 'son', 'hola', 'gracias', 'sí', 'no', 'cómo', 'por', 'qué', 'cuándo', 'dónde', 'quién', 'con', 'para', 'en', 'que', 'pero', 'salud', 'médico', 'enfermedad', 'dolor', 'síntoma', 'tratamiento', 'medicamento', 'tengo', 'tiene', 'estoy', 'está'],
    patterns: [/\b(yo|tú|él|ella|nosotros|ellos)\b/i, /\b(el|la|los|las|un|una)\b/i, /[áéíóúüñ¿¡]/i],
  },
  de: {
    words: ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'der', 'die', 'das', 'ein', 'eine', 'und', 'ist', 'sind', 'haben', 'sein', 'hallo', 'danke', 'ja', 'nein', 'wie', 'warum', 'wann', 'wo', 'wer', 'was', 'mit', 'für', 'in', 'auf', 'aber', 'gesundheit', 'arzt', 'krankheit', 'schmerz', 'symptom', 'behandlung', 'medikament', 'bitte', 'nicht', 'auch', 'noch', 'schon'],
    patterns: [/\b(ich|du|er|sie|wir|ihr)\b/i, /\b(der|die|das|ein|eine)\b/i, /[äöüß]/i],
  },
  it: {
    words: ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro', 'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'una', 'di', 'del', 'e', 'è', 'sono', 'avere', 'essere', 'ciao', 'grazie', 'sì', 'no', 'come', 'perché', 'quando', 'dove', 'chi', 'che', 'con', 'per', 'in', 'ma', 'salute', 'medico', 'malattia', 'dolore', 'sintomo', 'trattamento', 'farmaco', 'ho', 'ha', 'sto', 'sta'],
    patterns: [/\b(io|tu|lui|lei|noi|voi|loro)\b/i, /\b(il|lo|la|i|gli|le)\b/i, /[àèéìíîòóùú]/i],
  },
  pt: {
    words: ['eu', 'tu', 'ele', 'ela', 'nós', 'vós', 'eles', 'elas', 'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'e', 'é', 'são', 'ter', 'ser', 'olá', 'obrigado', 'sim', 'não', 'como', 'por', 'que', 'quando', 'onde', 'quem', 'com', 'para', 'em', 'mas', 'saúde', 'médico', 'doença', 'dor', 'sintoma', 'tratamiento', 'medicamento', 'tenho', 'tem', 'estou', 'está'],
    patterns: [/\b(eu|tu|ele|ela|nós|eles)\b/i, /\b(o|a|os|as|um|uma)\b/i, /[ãõáéíóúâêôàç]/i],
  },
};

function scoreLanguage(text: string, lang: string): number {
  const config = LANGUAGE_PATTERNS[lang];
  if (!config) return 0;

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  let score = 0;

  // Word matching
  for (const word of words) {
    if (config.words.includes(word)) {
      score += 2;
    }
  }

  // Pattern matching
  for (const pattern of config.patterns) {
    if (pattern.test(text)) {
      score += 3;
    }
  }

  return score;
}

const LANGUAGE_INFO: Record<string, { locale: string; name: string }> = {
  en: { locale: 'en-US', name: 'English' },
  fr: { locale: 'fr-FR', name: 'French' },
  es: { locale: 'es-ES', name: 'Spanish' },
  ar: { locale: 'ar-SA', name: 'Arabic' },
  zh: { locale: 'zh-CN', name: 'Chinese' },
  ja: { locale: 'ja-JP', name: 'Japanese' },
  ko: { locale: 'ko-KR', name: 'Korean' },
  de: { locale: 'de-DE', name: 'German' },
  it: { locale: 'it-IT', name: 'Italian' },
  pt: { locale: 'pt-BR', name: 'Portuguese' },
  ru: { locale: 'ru-RU', name: 'Russian' },
  hi: { locale: 'hi-IN', name: 'Hindi' },
  tr: { locale: 'tr-TR', name: 'Turkish' },
  nl: { locale: 'nl-NL', name: 'Dutch' },
  pl: { locale: 'pl-PL', name: 'Polish' },
  sv: { locale: 'sv-SE', name: 'Swedish' },
  da: { locale: 'da-DK', name: 'Danish' },
  fi: { locale: 'fi-FI', name: 'Finnish' },
  no: { locale: 'nb-NO', name: 'Norwegian' },
  id: { locale: 'id-ID', name: 'Indonesian' },
  ms: { locale: 'ms-MY', name: 'Malay' },
  th: { locale: 'th-TH', name: 'Thai' },
  vi: { locale: 'vi-VN', name: 'Vietnamese' },
  as: { locale: 'as-IN', name: 'Assamese' },
  bn: { locale: 'bn-IN', name: 'Bengali' },
  brx: { locale: 'brx-IN', name: 'Bodo' },
  doi: { locale: 'doi-IN', name: 'Dogri' },
  gu: { locale: 'gu-IN', name: 'Gujarati' },
  kn: { locale: 'kn-IN', name: 'Kannada' },
  ks: { locale: 'ks-IN', name: 'Kashmiri' },
  gom: { locale: 'kok-IN', name: 'Konkani' },
  mai: { locale: 'mai-IN', name: 'Maithili' },
  ml: { locale: 'ml-IN', name: 'Malayalam' },
  mni: { locale: 'mni-IN', name: 'Manipuri' },
  mr: { locale: 'mr-IN', name: 'Marathi' },
  ne: { locale: 'ne-NP', name: 'Nepali' },
  or: { locale: 'or-IN', name: 'Odia' },
  pa: { locale: 'pa-IN', name: 'Punjabi' },
  sa: { locale: 'sa-IN', name: 'Sanskrit' },
  sat: { locale: 'sat-IN', name: 'Santali' },
  sd: { locale: 'sd-IN', name: 'Sindhi' },
  ta: { locale: 'ta-IN', name: 'Tamil' },
  te: { locale: 'te-IN', name: 'Telugu' },
  ur: { locale: 'ur-PK', name: 'Urdu' },
};

export function detectLanguage(text: string): DetectedLanguage {
  if (!text || text.trim().length < 2) {
    return { code: 'en', locale: 'en-US', name: 'English', confidence: 'low' };
  }

  // ── High Confidence Script Checks ──
  if (hasUrduChars(text)) return { code: 'ur', locale: 'ur-PK', name: 'Urdu', confidence: 'high' };
  if (hasArabicChars(text)) return { code: 'ar', locale: 'ar-SA', name: 'Arabic', confidence: 'high' };
  if (hasJapaneseChars(text)) return { code: 'ja', locale: 'ja-JP', name: 'Japanese', confidence: 'high' };
  if (hasKoreanChars(text)) return { code: 'ko', locale: 'ko-KR', name: 'Korean', confidence: 'high' };
  if (hasCJKChars(text)) return { code: 'zh', locale: 'zh-CN', name: 'Chinese', confidence: 'high' };
  if (hasCyrillicChars(text)) return { code: 'ru', locale: 'ru-RU', name: 'Russian', confidence: 'high' };
  if (hasThaiChars(text)) return { code: 'th', locale: 'th-TH', name: 'Thai', confidence: 'high' };

  // Indian scripts
  if (hasBengaliChars(text)) return { code: 'bn', locale: 'bn-IN', name: 'Bengali', confidence: 'high' };
  if (hasGujaratiChars(text)) return { code: 'gu', locale: 'gu-IN', name: 'Gujarati', confidence: 'high' };
  if (hasGurmukhiChars(text)) return { code: 'pa', locale: 'pa-IN', name: 'Punjabi', confidence: 'high' };
  if (hasTamilChars(text)) return { code: 'ta', locale: 'ta-IN', name: 'Tamil', confidence: 'high' };
  if (hasTeluguChars(text)) return { code: 'te', locale: 'te-IN', name: 'Telugu', confidence: 'high' };
  if (hasKannadaChars(text)) return { code: 'kn', locale: 'kn-IN', name: 'Kannada', confidence: 'high' };
  if (hasMalayalamChars(text)) return { code: 'ml', locale: 'ml-IN', name: 'Malayalam', confidence: 'high' };
  if (hasOdiaChars(text)) return { code: 'or', locale: 'or-IN', name: 'Odia', confidence: 'high' };
  if (hasDevanagariChars(text)) return { code: 'hi', locale: 'hi-IN', name: 'Hindi', confidence: 'medium' };

  // ── Latin Script Scoring ──
  const scores: Record<string, number> = {};
  for (const lang of Object.keys(LANGUAGE_PATTERNS)) {
    scores[lang] = scoreLanguage(text, lang);
  }

  // Priority to English if scores are close or zero
  if (scores.en >= 2 || Object.values(scores).every(s => s === 0)) {
    return { code: 'en', locale: 'en-US', name: 'English', confidence: scores.en >= 6 ? 'high' : 'medium' };
  }

  const bestLang = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (bestLang && bestLang[1] >= 4) {
    const code = bestLang[0] as SupportedLanguage;
    const info = LANGUAGE_INFO[code] || LANGUAGE_INFO['en'];
    return {
      code,
      locale: info.locale,
      name: info.name,
      confidence: bestLang[1] >= 8 ? 'high' : 'medium',
    };
  }

  // Final absolute fallback
  return { code: 'en', locale: 'en-US', name: 'English', confidence: 'low' };
}
