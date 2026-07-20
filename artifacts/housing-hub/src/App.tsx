import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch, Route, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';

// Pages
import Home from '@/pages/Home';
import BuyPage from '@/pages/BuyPage';
import RentPage from '@/pages/RentPage';
import NeighborhoodsPage from '@/pages/NeighborhoodsPage';
import AssistancePage from '@/pages/AssistancePage';
import ContactPage from '@/pages/ContactPage';
import ResourcesPage from '@/pages/ResourcesPage';
import EventsPage from '@/pages/EventsPage';
import SuccessStoriesPage from '@/pages/SuccessStoriesPage';
import JourneyPage from '@/pages/JourneyPage';
import QuizPage from '@/pages/QuizPage';
import SimulatorPage from '@/pages/SimulatorPage';
import WhyNewportNewsPage from '@/pages/WhyNewportNewsPage';
import PartnersPage from '@/pages/PartnersPage';
import NotFound from '@/pages/not-found';
import ServicesPage from '@/pages/ServicesPage';
import ChecklistPage from '@/pages/ChecklistPage';
import ShipPage from '@/pages/ShipPage';
import { HelpLineStrip } from '@/components/HelpLineStrip';
import { AccessibilityWidget } from '@/components/AccessibilityWidget';
import { CityLiveFeed } from '@/components/CityLiveFeed';

const queryClient = new QueryClient();

// REQUIRED — copy verbatim. Resolves the key from window.location.hostname so the
// same build serves multiple Clerk custom domains.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — empty in dev (intentional), auto-set in prod. Do not gate on env.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: 'hsl(217, 71%, 15%)',
    colorForeground: 'hsl(220, 25%, 15%)',
    colorMutedForeground: 'hsl(220, 10%, 44%)',
    colorDanger: 'hsl(0, 72%, 45%)',
    colorBackground: '#ffffff',
    colorInput: '#ffffff',
    colorInputForeground: 'hsl(220, 25%, 15%)',
    colorNeutral: 'hsl(220, 15%, 55%)',
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl border border-slate-200',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-slate-900 font-extrabold',
    headerSubtitle: 'text-slate-500',
    socialButtonsBlockButtonText: 'text-slate-700 font-medium',
    formFieldLabel: 'text-slate-700 font-medium',
    footerActionLink: 'text-teal-600 hover:text-teal-700 font-semibold',
    footerActionText: 'text-slate-500',
    dividerText: 'text-slate-400',
    identityPreviewEditButton: 'text-teal-600',
    formFieldSuccessText: 'text-emerald-600',
    alertText: 'text-red-600',
    logoBox: 'justify-center',
    logoImage: 'h-9',
    socialButtonsBlockButton: 'border border-slate-200 hover:bg-slate-50',
    formButtonPrimary: 'bg-[#0A2540] hover:bg-[#0d2f52] text-white font-semibold',
    formFieldInput: 'border-slate-300 focus:border-teal-500',
    footerAction: 'justify-center',
    dividerLine: 'bg-slate-200',
    alert: 'border border-red-200 bg-red-50',
    otpCodeFieldInput: 'border-slate-300',
    formFieldRow: 'gap-2',
    main: 'gap-5',
  },
};

function SignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-24">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-24">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

// Invalidate cached queries when the signed-in user changes.
function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

/** Wraps each page in a smooth fade+slide entrance. */
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      key={window.location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </motion.div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <HelpLineStrip />
      <Footer />
      <ChatWidget />
      <AccessibilityWidget />
      <CityLiveFeed />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location}>
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/buy" component={BuyPage} />
            <Route path="/rent" component={RentPage} />
            <Route path="/neighborhoods" component={NeighborhoodsPage} />
            <Route path="/assistance" component={AssistancePage} />
            <Route path="/journey" component={JourneyPage} />
            <Route path="/simulator" component={SimulatorPage} />
            <Route path="/why-newport-news" component={WhyNewportNewsPage} />
            <Route path="/partners" component={PartnersPage} />
            <Route path="/quiz" component={QuizPage} />
            <Route path="/resources" component={ResourcesPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/success-stories" component={SuccessStoriesPage} />
            <Route path="/checklist" component={ChecklistPage} />
            <Route path="/ship" component={ShipPage} />
            <Route path="/contact" component={ContactPage} />
            {/* REQUIRED — "/sign-in/*?" and "/sign-up/*?" verbatim for Clerk OAuth sub-paths */}
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </AnimatePresence>
    </Layout>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: 'Welcome back',
            subtitle: 'Sign in to My Newport News',
          },
        },
        signUp: {
          start: {
            title: 'Create your My Newport News account',
            subtitle: 'Save your trash day, bill reminders, and favorite services',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
