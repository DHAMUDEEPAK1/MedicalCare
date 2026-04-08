import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MessageSquare } from 'lucide-react';
import { AssistantPanel } from './AssistantPanel';
import { AssistantMessage, AssistantStatus } from './assistantTypes';
import { interpretCommand } from './assistantBrain';
import { loadTranscript, saveTranscript, clearTranscript } from './assistantStorage';
import { useAssistantAI } from './useAssistantAI';
import { useSpeechRecognition } from './useSpeechRecognition';

export function AssistantWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transcript, setTranscript] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const ai = useAssistantAI();

  // Unified status from the AI hook
  const status: AssistantStatus = ai.status;

  // Wake Word Detection
  const { isWakeWordDetected, setIsWakeWordDetected, start: startListening } = useSpeechRecognition();

  // Handle Wake Word
  useEffect(() => {
    if (isWakeWordDetected) {
      setIsOpen(true);
      setIsWakeWordDetected(false); // Reset so it can trigger again
    }
  }, [isWakeWordDetected, setIsWakeWordDetected]);

  // Start listening for wake word on mount (silent)
  useEffect(() => {
    startListening();
  }, [startListening]);

  // Load transcript from storage on mount
  useEffect(() => {
    const stored = loadTranscript();
    if (stored && stored.messages.length > 0) {
      setTranscript(stored.messages as AssistantMessage[]);
    }
  }, []);

  // Save transcript to storage whenever it changes
  useEffect(() => {
    if (transcript.length > 0) {
      saveTranscript(transcript);
    }
  }, [transcript]);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const message: AssistantMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: Date.now(),
    };
    setTranscript(prev => [...prev, message]);
  }, []);

  const handleCommand = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    // The useAssistantAI hook processCommand handles the actual AI work, 
    // but the local interpretCommand handles the instantaneous local-only bridge

    // Add user message
    addMessage('user', userInput);
    setInputValue('');
    setErrorMessage(undefined);

    // Call the AI processor
    await ai.processCommand(userInput, transcript, addMessage);

    // After processCommand returns, we check if we need to navigate
    const result = interpretCommand(userInput);
    if (result.type === 'navigation' && result.navigationTarget) {
      setTimeout(() => {
        navigate({ to: result.navigationTarget as '/' | '/signin' | '/home' | '/profile' });
      }, 500);
    }
  }, [addMessage, navigate, ai, transcript]);

  const handleVoiceInput = useCallback((text: string) => {
    handleCommand(text);
  }, [handleCommand]);

  const handleFileUpload = useCallback((file: File) => {
    ai.processUploadedFile(file, addMessage);
  }, [ai.processUploadedFile, addMessage]);

  const handleClearConversation = useCallback(() => {
    setTranscript([]);
    clearTranscript();
    setErrorMessage(undefined);
    setInputValue('');
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground group"
          aria-label="Open voice assistant"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <AssistantPanel
          transcript={transcript}
          status={status}
          errorMessage={errorMessage}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onVoiceInput={handleVoiceInput}
          onClearConversation={handleClearConversation}
          onFileUpload={handleFileUpload}
        />
      </SheetContent>
    </Sheet>
  );
}
