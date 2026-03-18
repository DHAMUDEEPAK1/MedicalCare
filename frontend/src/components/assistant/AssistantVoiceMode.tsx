import { useEffect, useState } from 'react';
import { Mic, MicOff, PhoneOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AssistantStatus } from './assistantTypes';

interface AssistantVoiceModeProps {
    isOpen: boolean;
    onClose: () => void;
    isListening: boolean;
    isSpeaking: boolean;
    status: AssistantStatus;
    startListening: () => void;
    stopListening: () => void;
    transcriptText?: string;
}

export function AssistantVoiceMode({
    isOpen,
    onClose,
    isListening,
    isSpeaking,
    status,
    startListening,
    stopListening,
    transcriptText
}: AssistantVoiceModeProps) {
    const [pulseScale, setPulseScale] = useState(1);

    // Animate avatar based on state
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSpeaking) {
            // Simulate mouth/avatar movement when speaking
            interval = setInterval(() => {
                setPulseScale(1 + Math.random() * 0.3);
            }, 100);
        } else if (isListening) {
            // Breathe when listening
            interval = setInterval(() => {
                setPulseScale(prev => (prev > 1.1 ? 1 : 1.2));
            }, 1000);
        } else if (status === 'processing') {
            // Fast pulsing when thinking
            interval = setInterval(() => {
                setPulseScale(prev => (prev > 1.05 ? 1 : 1.1));
            }, 300);
        } else {
            setPulseScale(1);
        }

        return () => clearInterval(interval);
    }, [isSpeaking, isListening, status]);

    if (!isOpen) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-[100] transition-all duration-700 flex flex-col items-center justify-between p-8 animate-in fade-in",
            isSpeaking ? "bg-[#050510]" : status === 'processing' ? "bg-[#0a0510]" : isListening ? "bg-[#051005]" : "bg-[#050710]"
        )}>
            {/* Liquid Background Gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={cn(
                    "absolute -top-[20%] -left-[20%] w-[140%] h-[140%] opacity-40 transition-all duration-1000 blur-[120px] animate-pulse",
                    isSpeaking ? "bg-gradient-to-br from-primary via-indigo-500 to-blue-600" :
                        status === 'processing' ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-600" :
                            isListening ? "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600" :
                                "bg-gradient-to-br from-primary/20 via-background to-secondary/10"
                )} style={{ transform: `rotate(${pulseScale * 5}deg)` }} />
            </div>

            {/* Header */}
            <div className="relative z-10 w-full flex flex-col items-center max-w-md pt-8">
                <div className="p-2 rounded-2xl bg-white/5 backdrop-blur-md mb-4 border border-white/10">
                    <Sparkles className={cn("h-6 w-6 transition-colors duration-500", isSpeaking ? "text-primary" : "text-muted-foreground")} />
                </div>
                <h2 className="text-3xl font-black tracking-widest text-white/90 uppercase">Goku</h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                        "h-2 w-2 rounded-full animate-ping",
                        isSpeaking ? "bg-primary" : status === 'processing' ? "bg-amber-400" : "bg-green-400"
                    )} />
                    <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                        {isSpeaking ? 'Speaking' : status === 'processing' ? 'Generating response' : isListening ? 'Listening' : 'Ready'}
                    </p>
                </div>
            </div>

            {/* Center Avatar (Gemini Style) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md">
                {/* Outer Glow Rings */}
                <div className={cn(
                    "absolute w-80 h-80 rounded-full border-2 border-white/5 transition-all duration-1000",
                    isSpeaking || isListening ? "scale-110 opacity-100" : "scale-100 opacity-20"
                )} style={{ transform: `scale(${pulseScale * 1.2})` }} />

                <div className={cn(
                    "absolute w-64 h-64 rounded-full border border-white/10 transition-all duration-700",
                    isSpeaking || isListening ? "scale-110 opacity-80" : "scale-100 opacity-20"
                )} style={{ transform: `scale(${pulseScale * 1.1})` }} />

                <div
                    className={cn(
                        "absolute w-48 h-48 rounded-full blur-[60px] transition-all duration-500 opacity-30",
                        isSpeaking ? "bg-primary" : status === 'processing' ? "bg-amber-500" : "bg-green-500"
                    )}
                    style={{ transform: `scale(${pulseScale * 1.5})` }}
                />

                {/* The Core Avatar */}
                <div
                    className={cn(
                        "relative w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 border-2",
                        isSpeaking ? "bg-white text-primary border-primary" :
                            status === 'processing' ? "bg-amber-100/10 text-amber-500 border-amber-500/20" :
                                "bg-white/5 text-white/40 border-white/10"
                    )}
                    style={{ transform: `scale(${pulseScale})` }}
                >
                    <div className={cn(
                        "absolute inset-0 rounded-full animate-ping opacity-20 bg-current",
                        !isSpeaking && !isListening && "hidden"
                    )} />
                    {isSpeaking ? (
                        <div className="flex gap-1 items-end h-8">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-1 bg-primary rounded-full animate-bounce" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    ) : isListening ? (
                        <Mic className="h-10 w-10 animate-pulse" />
                    ) : (
                        <Sparkles className="h-10 w-10" />
                    )}
                </div>

                {/* Live Subtitles (Refined) */}
                <div className="mt-20 text-center px-4 h-32 overflow-hidden flex items-center justify-center">
                    <p className="text-xl md:text-2xl font-light text-white leading-relaxed tracking-tight transition-all duration-500 drop-shadow-lg">
                        {transcriptText ? (
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                {transcriptText}
                            </span>
                        ) : (
                            <span className="text-white/20 italic">
                                {isListening ? "Say something..." : "Waiting for command"}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 w-full max-w-md flex justify-center items-center gap-12 mb-12">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-20 w-20 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all active:scale-95"
                    onClick={() => isListening ? stopListening() : startListening()}
                >
                    {isListening ? <Mic className="h-8 w-8 text-green-400" /> : <MicOff className="h-8 w-8" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-20 w-20 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500/20 hover:border-red-500/40 transition-all active:scale-95"
                    onClick={onClose}
                >
                    <PhoneOff className="h-8 w-8" />
                </Button>
            </div>
        </div>
    );
}
