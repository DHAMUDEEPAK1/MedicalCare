import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardSectionHeaderProps {
  title: string;
  caption?: string;
  action?: ReactNode;
  className?: string;
}

export function DashboardSectionHeader({ title, caption, action, className }: DashboardSectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground font-heading">
          {title}
        </h2>
        {caption && (
          <p className="text-sm text-muted-foreground mt-1">{caption}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
