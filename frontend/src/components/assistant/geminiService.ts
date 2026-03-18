import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzeFileWithGemini(bytes: Uint8Array, mimeType: string): Promise<string> {
    try {
        // Convert Uint8Array to base64 safely - using chunked approach for large files
        let base64Data = "";
        const chunk_size = 8192;
        for (let i = 0; i < bytes.length; i += chunk_size) {
            base64Data += String.fromCharCode.apply(null, Array.from(bytes.slice(i, i + chunk_size)));
        }
        base64Data = btoa(base64Data);

        const prompt = `Please analyze this medical document. 
        If it is a Prescription: Extract all medications, dosages, and timings. Create a clear morning/afternoon/evening schedule.
        If it is a Lab Report/Test Result: Explain the key findings in simple language, highlight anything outside normal range, and suggest next steps.
        Always maintain a professional but helpful tone. Respond in English unless the document is entirely in another language.`;

        // The @google/genai SDK (v1.x) API usage:
        const response = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: mimeType
                            }
                        }
                    ]
                }
            ]
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw new Error("Failed to analyze document with AI.");
    }
}
