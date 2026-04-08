import { Outlet, useLocation, Link } from '@tanstack/react-router';
import { DesignBBottomTabs } from './DesignBBottomTabs';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { Heart } from 'lucide-react';
import { AssistantWidget } from '../../components/assistant/AssistantWidget';

// Pages where bottom nav should be hidden
const HIDE_BOTTOM_NAV = ['/', '/signin', '/signup', '/chat', '/terms', '/privacy-policy'];
// Pages where header should be hidden
const HIDE_HEADER = ['/', '/signin', '/signup', '/chat', '/terms', '/privacy-policy'];
// Pages where assistant widget should be hidden
const HIDE_ASSISTANT = ['/', '/signin', '/signup', '/terms', '/privacy-policy'];

export function DesignBAppShell() {
  const location = useLocation();
  const hideBottomNav = HIDE_BOTTOM_NAV.includes(location.pathname);
  const hideHeader = HIDE_HEADER.includes(location.pathname);
  const hideAssistant = HIDE_ASSISTANT.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Floating Goku Quick Access */}
      {!hideAssistant && <AssistantWidget />}

      {/* Header */}
      {!hideHeader && (
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
      <main className={`flex-1 ${!hideBottomNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && <DesignBBottomTabs />}

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
        <div className="container px-4 space-y-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <a href="mailto:support@yourdomain.com" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p>
            © 2026 HealthCare. Built with{' '}
            <Heart className="inline h-3 w-3 text-destructive fill-destructive" />{' '}
            for your wellness.
          </p>
        </div>
      </footer>
    </div>
  );
}
