/**
 * 🩺 Clinical Consultation Engine
 * Authoritative, deterministically-driven medical report analysis.
 * Emulates a high-fidelity 'Doctor to Patient' strategic consultation.
 */

export interface ClinicalStrategicResult {
  consultationSummary: string;
  keyClinicalFindings: string[];
  strategicInterpretation: string;
  wellnessRoadMap: string[];
  criticalSignals: string[];
  professionalDisclaimer: string;
}

/**
 * Executes a full clinical scan of the report text.
 * Adopt persona: Clinical Health Strategist (Goku)
 */
export function analyzeReportText(reportText: string, filename: string): ClinicalStrategicResult {
  const findings = extractClinicalMarkers(reportText);
  const interpretation = synthesizeClinicalInterpretation(findings, reportText);
  const roadMap = generateWellnessRoadMap(findings, reportText);
  const signals = detectCriticalSignals(reportText);

  const summary = `### 🩺 Clinical Consultation: ${filename}\n\nGreetings. As your **Clinical Health Strategist**, I have conducted an exhaustive heuristic scan of your report. I've identified several key markers that we need to examine to optimize your current wellness trajectory. \n\n**Analysis Status:** ${signals.length > 0 ? "⚠️ DEVIATIONS DETECTED" : "🟢 OPTIMAL PROFILE DETECTED"}`;

  return {
    consultationSummary: summary,
    keyClinicalFindings: findings,
    strategicInterpretation: interpretation,
    wellnessRoadMap: roadMap,
    criticalSignals: signals,
    professionalDisclaimer: getStrategicDisclaimer(),
  };
}

function extractClinicalMarkers(text: string): string[] {
  const findings: string[] = [];
  
  // High-precision pattern matching for clinical values
  const patterns = [
    // Lab values (e.g., Hemoglobin: 14.5 g/dL)
    /([A-Za-z\s]+):\s*(\d+\.?\d*)\s*([a-zA-Z/%μ]+)?/g,
    // Formal Impressions
    /(?:IMPRESSION|DIAGNOSIS|FINDINGS):\s*([^\n.]+)/gi,
    // Status indicators
    /(?:POSITIVE|NEGATIVE|REACTIVE|NON-REACTIVE|NORMAL|ABNORMAL|ELEVATED|LOW|HIGH)\s+(?:for|result)?\s+([A-Za-z\s]+)/gi
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[0].length > 4 && match[0].length < 150) {
        findings.push(match[0].trim());
      }
    }
  });

  return Array.from(new Set(findings)).slice(0, 12);
}

function synthesizeClinicalInterpretation(findings: string[], fullText: string): string {
  const lower = fullText.toLowerCase();
  const insights: string[] = [];

  // Strategic Category Checks
  if (lower.includes('diabetes') || lower.includes('glucose') || lower.includes('hba1c')) {
    insights.push("> **Endocrine Insight**: I'm observing signals related to your glucose metabolism. Your glycemic index is a primary driver of your long-term cellular energy and vascular health.");
  }

  if (lower.includes('hemoglobin') || lower.includes('hgb') || lower.includes('iron') || lower.includes('ferritin')) {
    insights.push("> **Hematology Insight**: The oxygen-carrying capacity of your blood (Hemoglobin) is a critical performance metric. Fluctuations here can significantly impact your recovery and energy levels.");
  }

  if (lower.includes('cholesterol') || lower.includes('lipid') || lower.includes('ldl') || lower.includes('hdl')) {
    insights.push("> **Cardiovascular Insight**: Your lipid profile serves as the structural roadmap for your arterial health. Maintaining an optimal LDL/HDL ratio is a top priority for our cardiovascular strategy.");
  }

  if (lower.includes('thyroid') || lower.includes('tsh') || lower.includes('t4')) {
    insights.push("> **Metabolic Insight**: These thyroid markers regulate the 'speed' of your metabolic engine. Any deviation here can manifest as fatigue or unexpected weight changes.");
  }

  if (lower.includes('liver') || lower.includes('alt') || lower.includes('ast') || lower.includes('bilirubin')) {
    insights.push("> **Hepatic Insight**: Your liver enzymes reflect your body's detoxification efficiency. Elevated markers may indicate hepatic stress or environmental overload.");
  }

  if (lower.includes('renal') || lower.includes('creatinine') || lower.includes('urea') || lower.includes('kidney')) {
    insights.push("> **Renal Insight**: These markers track your kidney's filtration precision. They are vital for maintaining systemic mineral balance and blood pressure stability.");
  }

  if (insights.length === 0) {
    insights.push("> **General Clinical Observation**: This report contains various physiological metrics. While many appear standard, my protocol is to view them as a collective baseline for your future health milestones.");
  }

  return insights.join('\n\n');
}

function generateWellnessRoadMap(findings: string[], fullText: string): string[] {
  const plan: string[] = [];
  const lower = fullText.toLowerCase();

  plan.push("Schedule a formal follow-up with your primary physician to validate these heuristics.");

  if (/abnormal|elevated|high|low|outside.*range/i.test(fullText)) {
    plan.push("Prepare a targeted list of questions regarding the specific deviations I've highlighted.");
  }

  if (lower.includes('glucose') || lower.includes('sugar')) {
    plan.push("Implement a 7-day refined sugar audit to stabilize your glycemic response.");
  }

  if (lower.includes('cholesterol') || lower.includes('lipid')) {
    plan.push("Prioritize Omega-3 rich intake and moderate cardiovascular exercise (30 mins/day).");
  }

  if (lower.includes('hemoglobin') || lower.includes('anemia')) {
    plan.push("Introduce iron-rich nutrient density (dark leafy greens, lean proteins) alongside Vitamin C to enhance absorption.");
  }

  plan.push("Archive this consultation in your secure health vault for longitudinal tracking.");

  return plan;
}

function detectCriticalSignals(text: string): string[] {
  const flags: string[] = [];
  
  const emergencyPatterns = [
    { pattern: /critical|emergency|severe|urgent/i, flag: "URGENT: Report contains high-priority critical indicators." },
    { pattern: /malignant|cancer|tumor|mass/i, flag: "STRATEGIC ALERT: Mentions of potentially serious structural abnormalities detected." },
    { pattern: /acute|crisis/i, flag: "ACUTE ALERT: Clinical markers indicate an immediate systemic stressor." }
  ];

  emergencyPatterns.forEach(({ pattern, flag }) => {
    if (pattern.test(text)) flags.push(flag);
  });

  return flags;
}

function getStrategicDisclaimer(): string {
  return `### 🛡️ Professional Disclaimer
  
I am your **Local Clinical AI Strategist**, not a medical doctor. This analysis is an automated heuristic interpretation provided for educational coordination.

**Protocol:**
• This report does not constitute a legal medical diagnosis.
• Clinical values are subject to laboratory-specific calibration ranges.
• Use this analysis as a structured preparation for your professional medical consultation.
• **EMERGENCY:** If you are experiencing chest pain, difficulty breathing, or sudden confusion, call 911 (or local emergency services) immediately.`;
}

/**
 * Formats the final 'Doctor' message.
 */
export function formatAnalysisMessage(analysis: ClinicalStrategicResult, filename: string): string {
  let message = `### 📋 Document Review: ${filename}\n\n${analysis.consultationSummary}\n\n`;

  // Findings
  if (analysis.keyClinicalFindings.length > 0) {
    message += `#### 📋 Key Identification Markers:\n`;
    analysis.keyClinicalFindings.forEach(f => message += `• ${f}\n`);
    message += `\n`;
  }

  // Strategic Insight
  message += `#### 🧬 Strategic Clinical Insight:\n`;
  message += `${analysis.strategicInterpretation}\n\n`;

  // Road Map
  message += `#### 🚀 Strategic Road Map:\n`;
  analysis.wellnessRoadMap.forEach((step, i) => message += `${i + 1}. **Action**: ${step}\n`);
  message += `\n`;

  // Critical Alerts
  if (analysis.criticalSignals.length > 0) {
    message += `#### ⚠️ Critical Strategic Alerts:\n`;
    analysis.criticalSignals.forEach(s => message += `• **${s}**\n`);
    message += `\n`;
  }

  message += `---\n${analysis.professionalDisclaimer}`;

  return message;
}
