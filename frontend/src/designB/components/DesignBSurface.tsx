import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DesignBSurfaceProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export function DesignBSurface({ children, variant = 'default', className }: DesignBSurfaceProps) {
  return (
    <div
      className={cn(
        'rounded-lg transition-all',
        {
          'bg-card': variant === 'default',
          'bg-card shadow-md': variant === 'elevated',
          'bg-card border border-border': variant === 'outlined',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
