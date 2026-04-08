import { useState, useCallback, useEffect } from 'react';
import { AssistantMessage } from './assistantTypes';
import { interpretCommand, analyzeFile as analyzeMedicalFile } from './assistantBrain';
import { detectLanguage } from './languageDetector';
import { extractTextFromPDF } from './reportTextExtraction'; // Local clinical text extraction

export function useAssistantAI() {
    const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');

    // Initialize language from localStorage or browser preference
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const saved = localStorage.getItem('goku_lang_pref');
        if (saved) return saved;

        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('hi')) return 'hi-IN';
        if (browserLang.startsWith('bn')) return 'bn-IN';
        if (browserLang.startsWith('ta')) return 'ta-IN';
        if (browserLang.startsWith('te')) return 'te-IN';
        if (browserLang.startsWith('mr')) return 'mr-IN';
        if (browserLang.startsWith('gu')) return 'gu-IN';
        if (browserLang.startsWith('kn')) return 'kn-IN';
        if (browserLang.startsWith('ml')) return 'ml-IN';
        if (browserLang.startsWith('pa')) return 'pa-IN';
        return 'en-US';
    });

    // Persist language preference
    useEffect(() => {
        localStorage.setItem('goku_lang_pref', currentLanguage);
    }, [currentLanguage]);

    const processCommand = useCallback(async (
        userInput: string,
        _transcript: AssistantMessage[],
        onResponse: (role: 'user' | 'assistant', content: string, lang?: string) => void
    ) => {
        if (!userInput.trim()) return null;

        setStatus('processing');
        onResponse('user', userInput);

        try {
            // Small delay for natural UX feel
            await new Promise(r => setTimeout(r, 400));

            // Detect user's language from their input
            const languageInfo = detectLanguage(userInput);
            const detectedLocale = languageInfo.locale;

            // Update language preference if changed
            if (detectedLocale !== currentLanguage) {
                setCurrentLanguage(detectedLocale);
            }

            // Run local clinical brain - 100% OFFLINE
            const result = interpretCommand(userInput);

            // Add Goku-style formatting to responses
            let finalMessage = result.message;

            // Handle structured medical responses
            if (result.type === 'MEDICAL_RESPONSE' && result.content && result.content.message) {
                finalMessage = result.content.message;
            }

            if (result.type === 'MEDICAL_RESPONSE' || result.type === 'GENERAL_KNOWLEDGE' || result.type === 'EMERGENCY') {
                if (finalMessage && !finalMessage.includes('###')) {
                    finalMessage = `### Goku\n\n${finalMessage}`;
                }
            }

            onResponse('assistant', finalMessage, detectedLocale);
            setStatus('idle');
            return result;
        } catch (error) {
            console.error('Assistant processing error:', error);
            setStatus('error');
            onResponse('assistant', "Sorry, I encountered an error processing your request. Please try again!", currentLanguage);
            return null;
        }
    }, [currentLanguage]);

    const processUploadedFile = useCallback(async (
        file: File,
        onResponse: (role: 'user' | 'assistant', content: string, lang?: string) => void
    ) => {
        setStatus('processing');
        onResponse('user', `Uploaded file: ${file.name}`);

        try {
            // Read file bytes for Gemini Multimodal processing
            const arrayBuffer = await file.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);

            // Perform local document extraction if possible
            if (file.type === 'application/pdf') {
                try {
                    const text = await extractTextFromPDF(file);
                    if (text.trim()) {
                        const result = analyzeMedicalFile(file.name, text);
                        onResponse('assistant', result.message, currentLanguage);
                        return;
                    }
                } catch (error) {
                    console.error('Local PDF processing failed:', error);
                }
            }

            // Local Fallback: For simple text files
            if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
                const text = new TextDecoder().decode(bytes);
                if (text.trim().length > 0) {
                    const result = analyzeMedicalFile(file.name, text);
                    onResponse('assistant', result.message, currentLanguage);
                    return;
                }
            }

            // Local Fallback: For PDF if Gemini fails
            if (file.type === 'application/pdf') {
                try {
                    const text = await extractTextFromPDF(file);
                    console.log('Extracted PDF text (first 500 chars):', text.substring(0, 500));

                    if (text && text.trim()) {
                        const result = analyzeMedicalFile(file.name, text);
                        console.log('Analysis result:', result);
                        onResponse('assistant', result.message, currentLanguage);
                        return;
                    }
                } catch (pdfError) {
                    console.error("Local PDF scan failed:", pdfError);
                }
            }

            // Generic file handling
            const genericResponse = `### 📋 Goku's Analysis: ${file.name}

*I've received your medical document!*

**📁 File Details:**
- Name: ${file.name}
- Size: ${(file.size / 1024).toFixed(2)} KB
- Type: ${file.type || 'Unknown'}

**📊 How I Can Assist:**
- Share specific lab values to see my interpretation
- Provide medication names for a custom schedule
- Ask about any medical terms you don't understand

*Just tell me which part you'd like me to focus on first!*`;

            onResponse('assistant', genericResponse, currentLanguage);

        } catch (error) {
            console.error("File processing failed:", error);
            const errorMessage = `### ⚠️ Goku's Sensor Error: ${file.name}

*I encountered an issue while trying to scan your document.*

**🔧 Resolution Steps:**
- Try copy-pasting the text directly into the chat
- Ensure the file is not corrupted or password-protected
- Try converting the document to a simple text file

*Don't give up! I'm still here to help you understand your results!*`;

            onResponse('assistant', errorMessage, currentLanguage);
        } finally {
            setStatus('idle');
        }
    }, [currentLanguage]);

    return {
        status,
        currentLanguage,
        setCurrentLanguage,
        processCommand,
        processUploadedFile,
    };
}
