import React from 'react';
import { Switch, Route, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { AccessibilityWidget } from '@/components/AccessibilityWidget';

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <ChatWidget />
      <AccessibilityWidget />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
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
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
