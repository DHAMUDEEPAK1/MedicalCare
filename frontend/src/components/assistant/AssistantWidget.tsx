import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MessageSquare } from 'lucide-react';
import { AssistantPanel } from './AssistantPanel';
import { AssistantMessage, AssistantStatus } from './assistantTypes';
import { interpretCommand } from './assistantBrain';
import { loadTranscript, saveTranscript, clearTranscript } from './assistantStorage';
import { useSpeechRecognition } from './useSpeechRecognition';

export function AssistantWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<AssistantStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transcript, setTranscript] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');

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

    // Add user message
    addMessage('user', userInput);
    setInputValue('');
    setStatus('processing');
    setErrorMessage(undefined);

    // Simulate brief processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Interpret command
    const result = interpretCommand(userInput);

    // Handle navigation
    if (result.type === 'navigation' && result.navigationTarget) {
      addMessage('assistant', result.message);
      setStatus('idle');

      // Navigate after a brief delay to show the confirmation message
      setTimeout(() => {
        navigate({ to: result.navigationTarget as '/' | '/signin' | '/home' | '/profile' });
      }, 500);
    } else {
      // Add assistant response
      addMessage('assistant', result.message);
      setStatus('idle');
    }
  }, [addMessage, navigate]);

  const handleSendMessage = useCallback(() => {
    handleCommand(inputValue);
  }, [inputValue, handleCommand]);

  const handleVoiceInput = useCallback((text: string) => {
    handleCommand(text);
  }, [handleCommand]);

  const handleClearConversation = useCallback(() => {
    setTranscript([]);
    clearTranscript();
    setStatus('idle');
    setErrorMessage(undefined);
    setInputValue('');
  }, []);

  // Background recognition for manual button trigger
  const speech = useSpeechRecognition();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground group"
          aria-label="Open voice assistant"
          onClick={() => {
            setIsOpen(true);
            // Don't auto-start speech here, let the panel handle it if needed 
            // or let the user click the mic in the panel
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
        />
      </SheetContent>
    </Sheet>
  );
}

