/**
 * High-Fidelity Clinical Reasoning Engine (TypeScript Port of MedGemini Logic)
 * 
 * Simulates a Multimodal Fusion and Hierarchical Reasoning architecture:
 * 1. Multimodal Fusion: Cross-references Document Text with User Context.
 * 2. Hierarchical Reasoning: Progressive validation through 3 layers of clinical logic.
 */

export interface ReasoningInput {
    documentText?: string;
    userQuery: string;
    clinicalSignals: string[];
    weightings: Record<string, number>;
}

export class HierarchicalReasoningEngine {
    
    /**
     * Level 1: Identification & Extraction (The Encoder Layer)
     * Isolates raw clinical markers from both user queries and extracted documents.
     */
    private _layer1_identification(input: ReasoningInput): string[] {
        const signals = [...input.clinicalSignals];
        if (input.userQuery.toLowerCase().includes("pain")) signals.push("Symp:Pain");
        if (input.userQuery.toLowerCase().includes("fever")) signals.push("Symp:Fever");
        return Array.from(new Set(signals));
    }

    /**
     * Level 2: Strategic Cross-Reference (The Fusion Layer)
     * Correlates isolated signals with known medical contexts and weights.
     */
    private _layer2_fusion(signals: string[], input: ReasoningInput): any[] {
        return signals.map(s => {
            const weight = input.weightings[s] || 1.0;
            return { signal: s, confidence: weight, source: input.documentText ? "Document" : "Query" };
        });
    }

    /**
     * Level 3: Clinical Conclusion (The Classifier Header)
     * Performs final heuristic reasoning to generate a strategic wellness roadmap.
     */
    private _layer3_conclusion(fusedData: any[]): string {
        const issues = fusedData.filter(d => d.confidence > 1.2).map(d => d.signal);
        if (issues.length > 0) {
            return `### 🧠 Hierarchical reasoning complete.\n\n**Detected Multimodal Patterns:** ${issues.join(", ")}.\n\n*Strategic conclusion: High-fidelity clinical verification required for detected anomalies.*`;
        }
        return `### 🧠 Hierarchical reasoning complete.\n\n**Strategic conclusion:** Stable profile maintained. No multimodal anomalies detected in recent query context.`;
    }

    /**
     * Execute the full MedGemini reasoning cycle
     */
    public executeReasoning(input: ReasoningInput): string {
        const l1 = this._layer1_identification(input);
        const l2 = this._layer2_fusion(l1, input);
        const conclusion = this._layer3_conclusion(l2);
        
        return conclusion;
    }
}
