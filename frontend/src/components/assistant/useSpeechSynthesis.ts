import { useState, useCallback, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * useSpeechSynthesis with Custom Local Voice support (Web Speech API only)
 */
export function useSpeechSynthesis() {
  const [isSupported] = useState(typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false); // Default to silent

  const speak = useCallback((text: string, langCode: string = 'en-US') => {
    if (!text || !isEnabled) return;

    // Clean text for speech
    const cleanText = text
      .replace(/[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/[*#`~>\[\]()_|\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    // Cancel any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Get voices and select appropriate one
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.lang.startsWith(langCode.split('-')[0])) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0];

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    if (selectedVoice) utterance.voice = selectedVoice;

    // Goku-style voice settings
    utterance.rate = 1.0;       // Normal speed
    utterance.pitch = 0.5;      // Deeper voice (Goku's style)
    utterance.volume = 1.0;     // Full volume

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(utterance);
    }
  }, [isEnabled]);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
    cancel();
  }, [cancel]);

  return {
    isSupported,
    isSpeaking,
    isEnabled,
    speak,
    cancel,
    toggleEnabled,
    setIsEnabled
  };
}
