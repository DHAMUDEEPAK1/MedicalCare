import { Outlet, useLocation } from '@tanstack/react-router';
import { DesignBBottomTabs } from './DesignBBottomTabs';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { Heart } from 'lucide-react';
import { GokuQuickAccess } from '../../components/floating-assistant/gokuQuickAccess';

// Pages where header and bottom nav should be hidden (full-screen / onboarding)
const HIDDEN_NAV_PATHS = ['/', '/signin', '/signup', '/chat'];

export function DesignBAppShell() {
  const location = useLocation();
  const hideNavigation = HIDDEN_NAV_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Floating Goku Quick Access */}
      {!hideNavigation && <GokuQuickAccess />}

      {/* Header */}
      {!hideNavigation && (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/healthcare-logo.dim_512x512.png"
                alt="HealthCare"
                className="h-8 w-8"
              />
              <span className="font-bold text-lg">HealthCare</span>
            </div>
            <ThemeSwitcher />
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex - 1 ${!hideNavigation ? 'pb-20' : ''} `}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!hideNavigation && <DesignBBottomTabs />}

      {/* Footer — only on non-nav pages */}
      {!hideNavigation && (
        <footer className="border-t border-border bg-card py-4 text-center text-xs text-muted-foreground">
          <p>
            © 2026 HealthCare. Built with{' '}
            <Heart className="inline h-3 w-3 text-destructive fill-destructive" />{' '}
            for your wellness.
          </p>
        </footer>
      )}
    </div>
  );
}
