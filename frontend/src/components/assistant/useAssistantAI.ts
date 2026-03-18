import { useState, useCallback, useEffect } from 'react';
import { AssistantMessage } from './assistantTypes';
import { interpretCommand } from './assistantBrain';
import { detectLanguage } from './languageDetector';

export function useAssistantAI() {
    const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');

    // Initialize language from localStorage or browser preference
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const saved = localStorage.getItem('goku_lang_pref');
        if (saved) return saved;

        const b = navigator.language.toLowerCase();
        if (b.startsWith('hi')) return 'hi-IN';
        if (b.startsWith('bn')) return 'bn-IN';
        if (b.startsWith('ta')) return 'ta-IN';
        if (b.startsWith('te')) return 'te-IN';
        if (b.startsWith('mr')) return 'mr-IN';
        if (b.startsWith('gu')) return 'gu-IN';
        if (b.startsWith('kn')) return 'kn-IN';
        if (b.startsWith('ml')) return 'ml-IN';
        if (b.startsWith('pa')) return 'pa-IN';
        return 'en-US';
    });

    // Persist language preference
    useEffect(() => {
        localStorage.setItem('goku_lang_pref', currentLanguage);
    }, [currentLanguage]);

    const processCommand = useCallback(async (
        userInput: string,
        transcript: AssistantMessage[],
        onResponse: (role: 'user' | 'assistant', content: string, lang?: string) => void
    ) => {
        if (!userInput.trim()) return null;

        setStatus('processing');
        onResponse('user', userInput);

        // Small delay for natural UX feel
        await new Promise(r => setTimeout(r, 400));

        // Detect user's language from their input
        const languageInfo = detectLanguage(userInput);
        const detectedLang = languageInfo.code;
        const detectedLocale = languageInfo.locale;

        // Update language preference if changed
        if (detectedLocale !== currentLanguage) {
            setCurrentLanguage(detectedLocale);
        }

        // Run local brain — handles navigation, medical KB, general KB, specialty KB
        const result = interpretCommand(userInput, transcript);
        let finalMessage = result.message;

        // Automatically translate response if the user spoke/typed in a language other than English
        if (detectedLang !== 'en') {
            try {
                // Free, no-key translation endpoint (gtx)
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${detectedLang}&dt=t&q=${encodeURIComponent(finalMessage)}`;
                const res = await fetch(url);
                const data = await res.json();
                if (data && data[0]) {
                    finalMessage = data[0].map((item: any) => item[0]).join('');
                }
            } catch (e) {
                console.warn("Translation failed, falling back to English", e);
            }
        }

        // Respond with the local result (always works, no internet needed for English, requires net for dynamic translation)
        onResponse('assistant', finalMessage, detectedLocale);
        setStatus('idle');

        return result;
    }, [currentLanguage]);

    return {
        status,
        currentLanguage,
        setCurrentLanguage,
        processCommand,
    };
}
