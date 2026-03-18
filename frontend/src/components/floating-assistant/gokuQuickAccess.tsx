import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, X, Maximize2, Trash2, StopCircle } from 'lucide-react';
import { AssistantPanel } from '../assistant/AssistantPanel';
import { useAssistantTranscript } from '../assistant/useAssistantTranscript';
import { useNavigate } from '@tanstack/react-router';
import { useAssistantAI } from '../assistant/useAssistantAI';
import { useSpeechRecognition } from '../assistant/useSpeechRecognition';
import { useSpeechSynthesis } from '../assistant/useSpeechSynthesis';
import { cn } from '@/lib/utils';

export function GokuQuickAccess() {
    const [isOpen, setIsOpen] = useState(false);
    const session = useAssistantTranscript();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const ai = useAssistantAI();

    const handleCommand = useCallback(async (userInput: string) => {
        if (!userInput.trim()) return;
        setInputValue('');

        // Auto-open if closed
        if (!isOpen) setIsOpen(true);

        const result = await ai.processCommand(userInput, session.transcript, (role, content) => {
            session.addMessage(role, content);
        });

        if (result?.navigationTarget) {
            setTimeout(() => {
                setIsOpen(false);
                navigate({ to: result.navigationTarget as any });
            }, 2000);
        }
    }, [session, navigate, ai, isOpen]);

    const speech = useSpeechRecognition(handleCommand, ai.currentLanguage);
    const tts = useSpeechSynthesis();

    // Start background listening on mount
    useEffect(() => {
        speech.start();
        tts.setIsEnabled(true);
    }, []);

    // Effect to handle wake-up visual state
    useEffect(() => {
        if (speech.isWakeWordDetected && !isOpen) {
            setIsOpen(true);
        }
    }, [speech.isWakeWordDetected, isOpen]);

    return (
        <div className="fixed bottom-24 right-6 z-[60] group">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="icon"
                        className={cn(
                            "h-14 w-14 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] bg-primary hover:bg-primary/90 transition-all duration-500 scale-100 group-hover:scale-110 group-hover:rotate-12 active:scale-95",
                            isOpen && "opacity-0 scale-50"
                        )}
                    >
                        <Sparkles className="h-7 w-7 text-primary-foreground animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
                        </span>
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-transparent shadow-none gap-0 items-end justify-end pointer-events-none [&>button]:hidden">
                    <div className="w-full h-[600px] max-h-[85vh] bg-background border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-500">
                        {/* Minimal Header for Pop-up */}
                        <div className="p-4 flex items-center justify-between border-b border-border/40 bg-muted/30 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-bold text-sm">Goku Companion</span>
                            </div>
                            <div className="flex items-center gap-1 mr-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group/clear"
                                    onClick={() => session.clearTranscript()}
                                    title="Clear Conversation"
                                >
                                    <Trash2 className="h-4 w-4 group-hover/clear:scale-110 transition-transform" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-amber-500/10 hover:text-amber-500 transition-all duration-300"
                                    onClick={() => {
                                        speech.stop();
                                        tts.cancel();
                                    }}
                                    title="Stop Assistant"
                                >
                                    <StopCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110 active:scale-95 group/max"
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate({ to: '/chat' });
                                    }}
                                    title="Maximize to full page"
                                >
                                    <Maximize2 className="h-4 w-4 text-primary/60 group-hover/max:text-primary group-hover/max:scale-110 transition-all duration-300" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:rotate-90 active:scale-75 group/close"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4 group-hover/close:scale-125 transition-transform" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0">
                            <AssistantPanel
                                transcript={session.transcript}
                                status={ai.status as any}
                                inputValue={inputValue}
                                onInputChange={setInputValue}
                                onVoiceInput={handleCommand}
                                onClearConversation={session.clearTranscript}
                                showHeader={false}
                                externalSpeech={speech}
                                externalTts={tts}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
