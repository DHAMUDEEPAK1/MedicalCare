import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechRecognition(onCommandReady?: (text: string) => void, lang: string = 'en-US') {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const onCommandReadyRef = useRef(onCommandReady);

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

    // Set continuous to false for a clean "one command" session as requested
    recognition.continuous = false;
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
        // Force stop once we have a final command to ensure one beep only
        recognition.stop();
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
  }, [lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
    } catch (e) {
      console.error('[Goku Speech] Could not start:', e);
      // If already started, just ignore
    }
  }, []);

  const stop = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
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
    // Provide empty versions of removed wake feature properties to avoid breaking consumers
    isWakeWordDetected: false,
    setIsWakeWordDetected: () => { }
  };
}

