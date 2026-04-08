import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechRecognition(onCommandReady?: (text: string) => void, lang: string = 'en-US') {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isWakeWordDetected, setIsWakeWordDetected] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const onCommandReadyRef = useRef(onCommandReady);
  
  const WAKE_WORDS = ['hey goku', 'goku', 'wake up'];

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onCommandReadyRef.current = onCommandReady;
  }, [onCommandReady]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[Goku Speech] Speech recognition NOT supported by this browser.');
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();

    // Enable continuous listening for wake word support
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onstart = () => {
      console.log(`[Goku Speech] Listening (${lang})...`);
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        
        // Wake Word Detection
        const lowerText = text.toLowerCase().trim();
        if (WAKE_WORDS.some(word => lowerText.includes(word)) && !isWakeWordDetected) {
            console.log('[Goku Speech] 🚨 Wake Word Detected!');
            setIsWakeWordDetected(true);
        }

        if (result.isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setTranscript(final);
        console.log('[Goku Speech] Captured:', final);
        if (onCommandReadyRef.current) {
          onCommandReadyRef.current(final);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('[Goku Speech] Error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow in settings.');
      } else {
        setError(`Speech Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('[Goku Speech] Session Ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
    };
  }, [lang, isWakeWordDetected]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setTranscript('');
      setInterimTranscript('');
      setIsWakeWordDetected(false);
      recognitionRef.current.start();
    } catch (e) {
      console.error('[Goku Speech] Could not start:', e);
    }
  }, []);

  const stop = useCallback(() => {
    setIsListening(false);
    setIsWakeWordDetected(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setIsWakeWordDetected(false);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
    reset,
    isWakeWordDetected,
    setIsWakeWordDetected
  };
}
