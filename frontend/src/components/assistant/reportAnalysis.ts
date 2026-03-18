// Deterministic local report analysis utilities

export interface ReportAnalysisResult {
  keyFindings: string[];
  interpretation: string;
  suggestedActions: string[];
  redFlags: string[];
  disclaimer: string;
}

/**
 * Analyzes report text and extracts key information.
 * This is a deterministic, pattern-based analysis (no AI/LLM).
 */
export function analyzeReportText(reportText: string, filename: string): ReportAnalysisResult {
  const findings = extractKeyFindings(reportText);
  const interpretation = generateInterpretation(findings, reportText);
  const actions = generateSuggestedActions(findings, reportText);
  const redFlags = identifyRedFlags(reportText);

  return {
    keyFindings: findings,
    interpretation,
    suggestedActions: actions,
    redFlags,
    disclaimer: getReportDisclaimer(),
  };
}

function extractKeyFindings(text: string): string[] {
  const findings: string[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Look for common medical report patterns
  const patterns = [
    // Lab values with numbers
    /([A-Za-z\s]+):\s*(\d+\.?\d*)\s*([a-zA-Z/%]+)?/g,
    // Test results
    /(positive|negative|normal|abnormal|elevated|low|high)\s+for\s+([A-Za-z\s]+)/gi,
    // Diagnosis patterns
    /(diagnosis|impression|findings?):\s*([^\n]+)/gi,
    // Measurements
    /([A-Za-z\s]+)\s+(?:is|was|measures?)\s+(\d+\.?\d*)\s*([a-zA-Z/%]+)?/gi,
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[0].length > 5 && match[0].length < 200) {
        findings.push(match[0].trim());
      }
    }
  });

  // If no structured findings, extract lines that look like results
  if (findings.length === 0) {
    lines.forEach(line => {
      if (line.length > 10 && line.length < 200) {
        // Lines with numbers or medical keywords
        if (/\d/.test(line) || /result|test|level|count|pressure|rate/i.test(line)) {
          findings.push(line);
        }
      }
    });
  }

  // Limit to most relevant findings
  return findings.slice(0, 10);
}

function generateInterpretation(findings: string[], fullText: string): string {
  const lowerText = fullText.toLowerCase();
  const interpretations: string[] = [];

  // Check for common medical terms and provide educational context
  if (lowerText.includes('glucose') || lowerText.includes('blood sugar')) {
    interpretations.push('Blood glucose/sugar levels indicate how well your body is managing sugar. Normal fasting levels are typically 70-100 mg/dL.');
  }

  if (lowerText.includes('cholesterol')) {
    interpretations.push('Cholesterol levels help assess heart disease risk. Total cholesterol under 200 mg/dL is generally considered desirable.');
  }

  if (lowerText.includes('blood pressure') || lowerText.includes('bp')) {
    interpretations.push('Blood pressure readings show the force of blood against artery walls. Normal is typically below 120/80 mmHg.');
  }

  if (lowerText.includes('hemoglobin') || lowerText.includes('hgb') || lowerText.includes('hb')) {
    interpretations.push('Hemoglobin carries oxygen in your blood. Low levels may indicate anemia; high levels may indicate dehydration or other conditions.');
  }

  if (lowerText.includes('white blood cell') || lowerText.includes('wbc')) {
    interpretations.push('White blood cells fight infection. Elevated levels may indicate infection or inflammation; low levels may indicate immune system issues.');
  }

  if (lowerText.includes('thyroid') || lowerText.includes('tsh')) {
    interpretations.push('Thyroid tests measure thyroid hormone levels, which regulate metabolism. Abnormal levels can affect energy, weight, and mood.');
  }

  if (lowerText.includes('creatinine') || lowerText.includes('kidney')) {
    interpretations.push('Creatinine levels help assess kidney function. Elevated levels may indicate reduced kidney function.');
  }

  if (lowerText.includes('liver') || lowerText.includes('alt') || lowerText.includes('ast')) {
    interpretations.push('Liver enzyme tests assess liver health. Elevated levels may indicate liver inflammation or damage.');
  }

  // Check for abnormal/concerning terms
  if (/abnormal|elevated|high|low|outside.*range/i.test(fullText)) {
    interpretations.push('Some values appear to be outside normal ranges. This may or may not be concerning depending on your individual health context.');
  }

  if (interpretations.length === 0) {
    interpretations.push('This report contains medical test results or health information. The specific values and their significance depend on your individual health history and current condition.');
  }

  return interpretations.join('\n\n');
}

function generateSuggestedActions(findings: string[], fullText: string): string[] {
  const actions: string[] = [];
  const lowerText = fullText.toLowerCase();

  // Always recommend discussing with healthcare provider
  actions.push('Discuss these results with your healthcare provider to understand what they mean for your specific situation');

  // Specific recommendations based on content
  if (/abnormal|elevated|high|outside.*range/i.test(fullText)) {
    actions.push('Ask your doctor about any values that are outside the normal range and what steps, if any, you should take');
  }

  if (lowerText.includes('follow') || lowerText.includes('retest') || lowerText.includes('repeat')) {
    actions.push('Follow any recommended follow-up testing or appointments mentioned in the report');
  }

  if (lowerText.includes('medication') || lowerText.includes('treatment')) {
    actions.push('Discuss any recommended medications or treatments with your healthcare provider');
  }

  // General health actions
  actions.push('Keep this report in your medical records for future reference');
  actions.push('Bring this report to your next medical appointment');

  return actions;
}

function identifyRedFlags(text: string): string[] {
  const redFlags: string[] = [];
  const lowerText = text.toLowerCase();

  // Emergency/urgent keywords
  const urgentPatterns = [
    { pattern: /critical|severe|emergency|urgent|immediate/i, flag: 'Report contains urgent or critical findings' },
    { pattern: /malignant|cancer|tumor/i, flag: 'Report mentions potentially serious conditions' },
    { pattern: /acute|crisis/i, flag: 'Report indicates acute or crisis situation' },
    { pattern: /abnormal.*significant|significantly abnormal/i, flag: 'Report notes significantly abnormal findings' },
  ];

  urgentPatterns.forEach(({ pattern, flag }) => {
    if (pattern.test(text)) {
      redFlags.push(flag);
    }
  });

  // Always include general emergency guidance
  redFlags.push('🚨 If you experience severe symptoms (chest pain, difficulty breathing, severe bleeding, loss of consciousness), call 911 immediately');

  return redFlags;
}

function getReportDisclaimer(): string {
  return `⚠️ IMPORTANT DISCLAIMER:

This analysis is for educational purposes only and is NOT a medical diagnosis or professional medical advice. 

• I am an AI assistant, not a doctor
• Medical reports require professional interpretation
• Lab values must be considered in context of your complete health history
• Normal ranges vary by lab, age, sex, and individual factors
• Only your healthcare provider can properly interpret these results

NEXT STEPS:
✓ Schedule an appointment with your healthcare provider to review these results
✓ Bring this report to your appointment
✓ Ask questions about anything you don't understand
✓ Follow your doctor's recommendations

If you have urgent concerns or symptoms, contact your healthcare provider immediately or call 911 for emergencies.`;
}

/**
 * Formats the analysis result into a readable message for the assistant.
 */
export function formatAnalysisMessage(analysis: ReportAnalysisResult, filename: string): string {
  let message = `📋 **Analysis of: ${filename}**\n\n`;

  // Key Findings
  if (analysis.keyFindings.length > 0) {
    message += `**KEY FINDINGS:**\n`;
    analysis.keyFindings.forEach(finding => {
      message += `• ${finding}\n`;
    });
    message += `\n`;
  }

  // Interpretation
  message += `**WHAT THIS MAY INDICATE:**\n${analysis.interpretation}\n\n`;

  // Suggested Actions
  message += `**SUGGESTED NEXT STEPS:**\n`;
  analysis.suggestedActions.forEach(action => {
    message += `• ${action}\n`;
  });
  message += `\n`;

  // Red Flags
  if (analysis.redFlags.length > 0) {
    message += `**⚠️ IMPORTANT NOTES:**\n`;
    analysis.redFlags.forEach(flag => {
      message += `• ${flag}\n`;
    });
    message += `\n`;
  }

  // Disclaimer
  message += `\n${analysis.disclaimer}`;

  return message;
}
