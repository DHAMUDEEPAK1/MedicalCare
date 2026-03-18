import { useState, useCallback, useRef, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * useSpeechSynthesis with Custom Local Voice support
 * Falls back to Web Speech API if no custom voice is recorded
 */
export function useSpeechSynthesis() {
  const [isSupported] = useState(typeof window !== 'undefined' && ('speechSynthesis' in window || !!(window as any).Capacitor));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Custom Voice State
  const [hasCustomVoice, setHasCustomVoice] = useState(false);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check for custom voice on mount
  useEffect(() => {
    const checkCustomVoice = async () => {
      try {
        const result = await Filesystem.readFile({
          path: 'goku_custom_voice.wav',
          directory: Directory.Data,
        });
        if (result.data) {
          setHasCustomVoice(true);
          const blob = b64toBlob(result.data as string, 'audio/wav');
          const url = URL.createObjectURL(blob);
          customAudioRef.current = new Audio(url);
        }
      } catch (e) {
        // No custom voice found, will use system TTS
      }
    };
    checkCustomVoice();
  }, []);

  const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const speak = useCallback((text: string, langCode: string = 'en-US') => {
    if (!text || !isEnabled) return;

    // Strategy 1: Use Custom Local Voice if available
    // (Note: This is a placeholder logic. True local neural cloning without APIs 
    // requires a heavy WASM model like Piper or Coqui which usually stays server-side.
    // Here we use the user's recorded sample to provide the "Identity" of the voice)
    if (hasCustomVoice && customAudioRef.current) {
      console.log('[Goku Voice] Playing custom recorded voice sample');
      customAudioRef.current.play();
      setIsSpeaking(true);
      customAudioRef.current.onended = () => setIsSpeaking(false);
      return;
    }

    // Strategy 2: Web Speech Fallback (Standard TTS)
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/[*#`~>\[\]()_|\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.rate = 1.05;
    utterance.pitch = 0.55; // Goku deep voice

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isEnabled, hasCustomVoice]);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (customAudioRef.current) {
      customAudioRef.current.pause();
      customAudioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => {
      if (prev) cancel();
      return !prev;
    });
  }, [cancel]);

  return {
    isSupported,
    isSpeaking,
    isEnabled,
    speak,
    cancel,
    toggleEnabled,
    setIsEnabled,
    hasCustomVoice,
  };
}
