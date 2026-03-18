import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: TypographyProps) {
  return (
    <h1 className={cn('text-3xl md:text-4xl font-bold tracking-tight text-foreground', className)}>
      {children}
    </h1>
  );
}

export function SectionTitle({ children, className }: TypographyProps) {
  return (
    <h2 className={cn('text-xl md:text-2xl font-semibold text-foreground', className)}>
      {children}
    </h2>
  );
}

export function Caption({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}

export function BodyText({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-base text-foreground leading-relaxed', className)}>
      {children}
    </p>
  );
}
