import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { AppHeader } from "@/components/app-header";
import { MobileNav } from "@/components/mobile-nav";
import LandingPage from "@/pages/landing";
import JournalPage from "@/pages/journal";
import SummaryPage from "@/pages/summary";
import SpotsPage from "@/pages/spots";
import QuizPage from "@/pages/quiz";
import LibraryPage from "@/pages/library";
import AdminSpotsPage from "@/pages/admin-spots";
import NotFound from "@/pages/not-found";
import { Skeleton } from "@/components/ui/skeleton";

function AuthenticatedLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={JournalPage} />
          <Route path="/summary" component={SummaryPage} />
          <Route path="/spots" component={SpotsPage} />
          <Route path="/quiz" component={QuizPage} />
          <Route path="/library" component={LibraryPage} />
          <Route path="/admin" component={AdminSpotsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <MobileNav />
    </div>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <AuthenticatedLayout />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
