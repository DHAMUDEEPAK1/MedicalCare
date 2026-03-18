import React from 'react';

interface SuggestedPromptChipProps {
  prompt: string;
  onClick: (prompt: string) => void;
  icon?: string;
}

export function SuggestedPromptChip({ prompt, onClick, icon }: SuggestedPromptChipProps) {
  return (
    <button
      onClick={() => onClick(prompt)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-primary/40 transition-all duration-200 text-sm text-left text-foreground/80 hover:text-foreground group shadow-sm w-full"
    >
      {icon && <span className="text-base shrink-0">{icon}</span>}
      <span className="leading-snug">{prompt}</span>
    </button>
  );
}

export default SuggestedPromptChip;
