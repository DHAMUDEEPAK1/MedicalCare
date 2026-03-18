import React from 'react';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className = '' }: TypingIndicatorProps) {
  return (
    <div className={'flex items-center gap-3 ' + className}>
      <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
        <img
          src="/assets/generated/assistant-avatar.dim_64x64.png"
          alt="Assistant"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.innerHTML = '<span class="text-primary text-xs font-bold">AI</span>';
            }
          }}
        />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '1s' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: '150ms', animationDuration: '1s' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: '300ms', animationDuration: '1s' }}
        />
      </div>
    </div>
  );
}

export default TypingIndicator;
