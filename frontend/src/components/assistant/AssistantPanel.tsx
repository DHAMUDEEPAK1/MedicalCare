import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, Trash2, Loader2, Sparkles, X, Volume2, VolumeX, StopCircle } from 'lucide-react';
import { AssistantMessage, AssistantStatus } from './assistantTypes';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { AssistantVoiceMode } from './AssistantVoiceMode';
import { cn } from '@/lib/utils';
import { useAssistantAI } from './useAssistantAI';
import { INDIAN_LANGUAGES } from './languageMapping';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

interface AssistantPanelProps {
  transcript: AssistantMessage[];
  status: AssistantStatus;
  errorMessage?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onVoiceInput: (text: string) => void;
  onClearConversation: () => void;
  showHeader?: boolean;
  autoStartVoice?: boolean;
  externalSpeech?: any;
  externalTts?: any;
}

export function AssistantPanel({
  transcript,
  status,
  errorMessage,
  inputValue,
  onInputChange,
  onVoiceInput,
  onClearConversation,
  showHeader = true,
  autoStartVoice = false,
  externalSpeech,
  externalTts,
}: AssistantPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const ai = useAssistantAI();

  // Integrated Voice Submit Logic
  const internalSpeech = useSpeechRecognition((text) => {
    if (text.trim()) {
      onVoiceInput(text);
      setIsWaking(true);
      setTimeout(() => setIsWaking(false), 500);
    }
  }, ai.currentLanguage);

  const speech = externalSpeech || internalSpeech;
  const internalTts = useSpeechSynthesis();
  const tts = externalTts || internalTts;

  const [isWaking, setIsWaking] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [transcript.length, speech.interimTranscript]);

  // Handle auto-start listening
  useEffect(() => {
    if (autoStartVoice) {
      speech.start();
      tts.setIsEnabled(true);
    }
  }, [autoStartVoice]);

  // Handle Wake Word "Goku"
  useEffect(() => {
    if (speech.isWakeWordDetected) {
      setIsWaking(true);
      setTimeout(() => setIsWaking(false), 1500);
      // Reset detection so it can be triggered again
      speech.setIsWakeWordDetected(false);
    }
  }, [speech.isWakeWordDetected, speech]);

  const lastSpokenMessageId = useRef<string | null>(null);

  const speakFnRef = useRef(tts.speak);
  useEffect(() => {
    speakFnRef.current = tts.speak;
  }, [tts.speak]);

  // Speak assistant responses
  useEffect(() => {
    if (transcript.length > 0) {
      const lastMessage = transcript[transcript.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.id !== lastSpokenMessageId.current) {
        lastSpokenMessageId.current = lastMessage.id;

        // Use the current ref to avoid effect re-trigger cycles
        setTimeout(() => {
          // Detect which language to speak back in
          // For now we pass ai.currentLanguage, but in a smarter version 
          // we could store the detected language per message
          speakFnRef.current(lastMessage.content, ai.currentLanguage);
        }, 100);
      }
    }
  }, [transcript, ai.currentLanguage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onVoiceInput(inputValue);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      <AssistantVoiceMode
        isOpen={isVoiceModeOpen}
        onClose={() => {
          setIsVoiceModeOpen(false);
          speech.stop();
          tts.cancel();
        }}
        isListening={speech.isListening}
        isSpeaking={tts.isSpeaking}
        status={status}
        startListening={speech.start}
        stopListening={speech.stop}
        transcriptText={speech.interimTranscript || speech.transcript}
      />
      {/* Goku Header */}
      {showHeader && (
        <div className="p-6 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl transition-all duration-500",
              isWaking ? "bg-primary scale-125 shadow-lg shadow-primary/50" : "bg-primary/10"
            )}>
              <Sparkles className={cn(
                "h-5 w-5 transition-colors",
                isWaking ? "text-primary-foreground" : "text-primary animate-pulse"
              )} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Goku Assistant</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  status === 'processing' ? "bg-amber-400 animate-pulse" : "bg-green-500"
                )} />
                {isWaking ? 'Listening for command...' : (status === 'processing' ? 'Thinking...' : 'Assistant Ready')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { speech.stop(); tts.cancel(); }} className="rounded-full hover:bg-amber-500/10" title="Stop Assistant">
              <StopCircle className="h-5 w-5 text-muted-foreground hover:text-amber-500 transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" onClick={tts.toggleEnabled} className="rounded-full hover:bg-primary/10" title={tts.isEnabled ? "Mute Voice" : "Unmute Voice"}>
              {tts.isEnabled ? <Volume2 className="h-5 w-5 text-muted-foreground" /> : <VolumeX className="h-5 w-5 text-muted-foreground opacity-50" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClearConversation} className="rounded-full hover:bg-destructive/10" title="Clear Conversation">
              <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
        <div className="max-w-2xl mx-auto space-y-8">
          {transcript.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 relative">
                <div className={cn(
                  "absolute inset-0 rounded-full bg-primary/10 opacity-20",
                  speech.isListening ? "animate-ping" : ""
                )} />
                <Sparkles className={cn("h-10 w-10 text-primary", isWaking && "animate-bounce")} />
              </div>
              <h3 className="text-2xl font-bold mb-2">I'm Goku, your health companion</h3>
              <p className="text-muted-foreground max-w-sm">
                How can I help you today? Ask me to analyze a report or check your symptoms.
              </p>
            </div>
          ) : (
            transcript.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col animate-in fade-in slide-in-from-bottom-2",
                  message.role === 'user' ? "items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] rounded-3xl p-4 shadow-sm",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border/50 text-card-foreground rounded-tl-none"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-2 uppercase tracking-widest font-medium">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}

          {/* Live Transcript Bubble */}
          {(speech.isListening && speech.interimTranscript) && (
            <div className="flex justify-end animate-pulse">
              <div className="max-w-[80%] bg-primary/20 backdrop-blur-md rounded-3xl p-4 italic text-sm text-primary-foreground/80">
                "{speech.interimTranscript}..."
              </div>
            </div>
          )}

          {/* Scroll Anchor */}
          <div ref={scrollAnchorRef} className="h-0 w-0" />
        </div>
      </ScrollArea>

      {/* Interactive Bottom Section */}
      <div className="p-6 border-t border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto space-y-4">
          {errorMessage && (
            <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg flex items-center gap-2">
              <X className="h-3 w-3" /> {errorMessage}
            </div>
          )}

          <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-full border border-border/50 focus-within:border-primary/50 transition-all duration-300">
            <Select value={ai.currentLanguage} onValueChange={ai.setCurrentLanguage}>
              <SelectTrigger className="w-[140px] rounded-full border-none bg-transparent shadow-none hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold">{INDIAN_LANGUAGES.find(l => l.code === ai.currentLanguage)?.name}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {INDIAN_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={speech.isListening ? 'destructive' : 'outline'}
              size="icon"
              className={cn(
                "rounded-full h-12 w-12 flex-shrink-0 transition-all duration-500 shadow-lg border-primary/20",
                (speech.isListening || isWaking || isVoiceModeOpen) && "scale-110 shadow-primary/20 bg-primary/10 border-primary"
              )}
              onClick={() => {
                setIsVoiceModeOpen(true);
                tts.setIsEnabled(true);
                if (!speech.isListening) {
                  speech.start();
                }
              }}
              title="Start Voice & Face-to-Face Mode"
            >
              <Mic className={cn("h-5 w-5", (speech.isListening || isVoiceModeOpen) && "text-primary")} />
            </Button>

            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 outline-none text-foreground placeholder:text-muted-foreground/50"
              placeholder={speech.isListening ? "Listening... (or type here)" : "Ask Goku anything..."}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={status === 'processing'}
              autoComplete="off"
            />

            {tts.isSpeaking && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 flex-shrink-0 text-amber-500 hover:bg-amber-500/10"
                onClick={() => { speech.stop(); tts.cancel(); }}
                title="Stop Speaking"
              >
                <StopCircle className="h-5 w-5 animate-pulse" />
              </Button>
            )}



            <Button
              size="icon"
              className="rounded-full h-10 w-10 flex-shrink-0 mr-1"
              onClick={() => onVoiceInput(inputValue)}
              disabled={!inputValue.trim() || ai.status === 'processing'}
            >
              {ai.status === 'processing' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex justify-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-50">
              Powered by Goku Intelligence
            </p>
          </div>
        </div>
      </div>
    </div >
  );
}
