import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { DesignBProvider } from './designB/themeContext';
import { DesignBAppShell } from './designB/layout/DesignBAppShell';
import { lazy, Suspense } from 'react';

// Lazy load pages for better performance
const Welcome = lazy(() => import('./pages/Welcome'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Report = lazy(() => import('./pages/Report'));
const Chat = lazy(() => import('./pages/Chat'));
const Medications = lazy(() => import('./pages/Medications'));
const Terms = lazy(() => import('./pages/Terms'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const NotFoundRedirect = lazy(() => import('./pages/NotFoundRedirect'));

// Helper to wrap lazy components in Suspense with a loading state
const withSuspense = (Component: any) => () => (
  <Suspense fallback={
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  }>
    <Component />
  </Suspense>
);

const rootRoute = createRootRoute({
  component: () => <DesignBAppShell />,
});

const rootedNotFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/*',
  component: withSuspense(NotFoundRedirect),
});

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: withSuspense(Welcome),
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signin',
  component: withSuspense(SignIn),
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: withSuspense(SignUp),
});

const homeDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: withSuspense(Home),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: withSuspense(Profile),
});

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report',
  component: withSuspense(Report),
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: withSuspense(Chat),
});

const medicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/medications',
  component: withSuspense(Medications),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: withSuspense(Terms),
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: withSuspense(PrivacyPolicy),
});

const routeTree = rootRoute.addChildren([
  welcomeRoute,
  signInRoute,
  signUpRoute,
  homeDashboardRoute,
  profileRoute,
  reportRoute,
  chatRoute,
  medicationsRoute,
  termsRoute,
  privacyPolicyRoute,
  rootedNotFoundRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <DesignBProvider>
        <RouterProvider router={router} />
        <Toaster />
      </DesignBProvider>
    </ThemeProvider>
  );
}
