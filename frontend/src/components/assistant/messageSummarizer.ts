// Deterministic text summarization utility for medical assistant responses

interface SummarySection {
  symptoms?: string[];
  findings?: string[];
  recommendations?: string[];
  warnings?: string[];
}

// Medical terms to preserve
const MEDICAL_TERMS = [
  'diabetes', 'hypertension', 'cholesterol', 'blood pressure', 'glucose', 'insulin',
  'cardiovascular', 'coronary', 'artery', 'heart attack', 'stroke', 'angina',
  'asthma', 'bronchial', 'respiratory', 'inhaler', 'wheezing', 'ldl', 'hdl',
  'triglycerides', 'systolic', 'diastolic', 'a1c', 'hemoglobin', 'bmi',
  'thyroid', 'hormone', 'menstrual', 'pregnancy', 'pcos', 'endometriosis',
  'menopause', 'osteoporosis', 'arthritis', 'inflammation', 'infection',
  'allergy', 'allergen', 'antibiotic', 'medication', 'prescription', 'dosage',
  'mmhg', 'mg/dl', 'mcg', 'iu', 'ml', 'kg', 'lbs', 'bpm'
];

// Emergency indicators to preserve
const EMERGENCY_INDICATORS = [
  'emergency', 'urgent', 'immediate', 'call 911', '911', 'severe', 'critical',
  'life-threatening', 'seek medical attention', 'go to er', 'emergency room',
  'chest pain', 'difficulty breathing', 'loss of consciousness', 'stroke',
  'heart attack', 'bleeding', 'suicidal'
];

// Action verbs for recommendations
const ACTION_VERBS = [
  'consult', 'monitor', 'avoid', 'reduce', 'increase', 'maintain', 'check',
  'take', 'stop', 'start', 'limit', 'exercise', 'eat', 'drink', 'sleep',
  'call', 'visit', 'schedule', 'track', 'record', 'measure', 'test'
];

/**
 * Summarizes long assistant responses into concise bullet points
 * while preserving medical terminology and critical information
 */
export function summarizeMessage(content: string): string | null {
  // Only summarize messages longer than 300 characters
  if (content.length < 300) {
    return null;
  }

  const sections = extractSections(content);
  const summary = buildSummary(sections);

  return summary;
}

/**
 * Extracts structured information from the message content
 */
function extractSections(content: string): SummarySection {
  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
  const sections: SummarySection = {};

  let currentSection: keyof SummarySection | null = null;

  for (const line of lines) {
    // Skip section headers and decorative elements
    if (line.startsWith('**') || line === '---' || line.startsWith('🚨')) {
      // Detect section type
      if (line.includes('PROBLEM') || line.includes('What is')) {
        currentSection = 'findings';
      } else if (line.includes('PRECAUTIONS') || line.includes('PREVENTIVE')) {
        currentSection = 'recommendations';
      } else if (line.includes('EMERGENCY') || line.includes('WHEN TO SEEK')) {
        currentSection = 'warnings';
      } else if (line.includes('Symptoms')) {
        currentSection = 'symptoms';
      }
      continue;
    }

    // Extract bullet points
    if (line.startsWith('•')) {
      const point = line.substring(1).trim();
      
      // Categorize based on content
      if (isEmergencyIndicator(point)) {
        if (!sections.warnings) sections.warnings = [];
        sections.warnings.push(point);
      } else if (isActionItem(point)) {
        if (!sections.recommendations) sections.recommendations = [];
        sections.recommendations.push(point);
      } else if (currentSection === 'symptoms') {
        if (!sections.symptoms) sections.symptoms = [];
        sections.symptoms.push(point);
      } else if (currentSection === 'findings') {
        if (!sections.findings) sections.findings = [];
        sections.findings.push(point);
      } else if (currentSection === 'recommendations') {
        if (!sections.recommendations) sections.recommendations = [];
        sections.recommendations.push(point);
      } else if (currentSection === 'warnings') {
        if (!sections.warnings) sections.warnings = [];
        sections.warnings.push(point);
      }
    }
  }

  return sections;
}

/**
 * Builds a formatted summary from extracted sections
 */
function buildSummary(sections: SummarySection): string {
  const parts: string[] = [];

  // Emergency warnings first (highest priority)
  if (sections.warnings && sections.warnings.length > 0) {
    parts.push('⚠️ **Emergency Indicators:**');
    const topWarnings = sections.warnings.slice(0, 3);
    topWarnings.forEach(warning => {
      parts.push(`• ${warning}`);
    });
    parts.push('');
  }

  // Key findings
  if (sections.findings && sections.findings.length > 0) {
    parts.push('📊 **Key Information:**');
    const topFindings = sections.findings.slice(0, 4);
    topFindings.forEach(finding => {
      parts.push(`• ${condenseText(finding)}`);
    });
    parts.push('');
  }

  // Symptoms
  if (sections.symptoms && sections.symptoms.length > 0) {
    parts.push('🔍 **Common Symptoms:**');
    const topSymptoms = sections.symptoms.slice(0, 4);
    topSymptoms.forEach(symptom => {
      parts.push(`• ${condenseText(symptom)}`);
    });
    parts.push('');
  }

  // Recommendations
  if (sections.recommendations && sections.recommendations.length > 0) {
    parts.push('💡 **Key Recommendations:**');
    const topRecs = sections.recommendations.slice(0, 5);
    topRecs.forEach(rec => {
      parts.push(`• ${condenseText(rec)}`);
    });
    parts.push('');
  }

  // Add disclaimer
  parts.push('*This is a summary. Tap "Show Full Response" for complete information.*');

  return parts.join('\n');
}

/**
 * Condenses text while preserving medical terms and numbers
 */
function condenseText(text: string): string {
  // Remove parenthetical explanations unless they contain numbers or medical terms
  text = text.replace(/\([^)]*\)/g, (match) => {
    if (containsMedicalTerm(match) || /\d/.test(match)) {
      return match;
    }
    return '';
  });

  // Remove filler phrases
  const fillerPhrases = [
    'it is important to',
    'you should',
    'it is recommended that',
    'make sure to',
    'be sure to',
    'try to',
    'remember to'
  ];

  fillerPhrases.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi');
    text = text.replace(regex, '');
  });

  // Clean up extra spaces
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Checks if text contains emergency indicators
 */
function isEmergencyIndicator(text: string): boolean {
  const lowerText = text.toLowerCase();
  return EMERGENCY_INDICATORS.some(indicator => 
    lowerText.includes(indicator.toLowerCase())
  );
}

/**
 * Checks if text is an action item
 */
function isActionItem(text: string): boolean {
  const lowerText = text.toLowerCase();
  return ACTION_VERBS.some(verb => 
    lowerText.startsWith(verb.toLowerCase())
  );
}

/**
 * Checks if text contains medical terminology
 */
function containsMedicalTerm(text: string): boolean {
  const lowerText = text.toLowerCase();
  return MEDICAL_TERMS.some(term => 
    lowerText.includes(term.toLowerCase())
  );
}
