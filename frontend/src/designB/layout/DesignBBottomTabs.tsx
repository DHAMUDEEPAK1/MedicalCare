import { useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, User, FileText, MessageSquare, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/report', label: 'Reports', icon: FileText },
  { path: '/medications', label: 'Meds', icon: Pill },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
  { path: '/profile', label: 'Profile', icon: User },
];

export function DesignBBottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Button
              key={tab.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: tab.path })}
              className={cn(
                'flex flex-col items-center gap-0.5 h-auto py-2 px-3 flex-1 rounded-xl transition-all duration-300 ease-out hover:scale-105 active:scale-95',
                isActive
                  ? 'text-primary bg-primary/10 shadow-[0_4px_10px_rgba(0,0,0,0.05)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-transform duration-300 ease-out',
                  isActive ? 'scale-110 fill-primary/20 translate-y-[-2px]' : ''
                )}
              />
              <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
