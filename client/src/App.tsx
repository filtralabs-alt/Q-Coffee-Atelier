import { useState, useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { AppHeader } from "@/components/app-header";
import { MobileNav } from "@/components/mobile-nav";
import LandingPage from "@/pages/landing";
import JournalPage from "@/pages/journal";
import SummaryPage from "@/pages/summary";
import SpotsPage from "@/pages/spots";
import PlayIndex from "@/pages/play/index";
import PlayQuiz from "@/pages/play/quiz";
import PlayOrdem from "@/pages/play/ordem";
import LibraryPage from "@/pages/library";
import LibraryTorrefactionPage from "@/pages/library-torrefaction";
import LibraryV60Page from "@/pages/library-v60";
import LibraryChemexPage from "@/pages/library-chemex";
import AteliersPage from "@/pages/ateliers";
import AteliersEnfantsPage from "@/pages/ateliers-enfants";
import AteliersDomicilePage from "@/pages/ateliers-domicile";
import AteliersTeamBuildingPage from "@/pages/ateliers-team-building";
import AteliersCafeTechPage from "@/pages/ateliers-cafe-tech";
import AdminDashboardPage from "@/pages/admin-dashboard";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";
import logoIcon from "@assets/baristech-icon.png";
import logoIconWhite from "@assets/baristech-icon-white.png";

// Routes reachable without being logged in — the idea is to let visitors
// explore content that hooks them (recipes, quiz, workshops) before asking
// for an account, rather than gating everything behind the landing page.
const PUBLIC_ROUTES = [
  "/library",
  "/library/torrefaction",
  "/library/v60",
  "/library/chemex",
  "/ateliers",
  "/ateliers-enfants",
  "/ateliers-domicile",
  "/ateliers-team-building",
  "/ateliers-cafe-tech",
  "/quiz",
  "/play",
  "/play/quiz",
  "/play/ordem",
];

function AuthenticatedLayout() {
  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <AppHeader />
      <main className="flex-1 overflow-y-auto overscroll-contain pb-[72px] md:pb-4">
        <Switch>
          <Route path="/journal" component={JournalPage} />
          <Route path="/summary" component={SummaryPage} />
          <Route path="/spots" component={SpotsPage} />
          <Route path="/play" component={PlayIndex} />
          <Route path="/play/quiz" component={PlayQuiz} />
          <Route path="/play/ordem" component={PlayOrdem} />
          <Route path="/quiz"><Redirect to="/play/quiz" /></Route>
          <Route path="/library" component={LibraryPage} />
          <Route path="/library/torrefaction" component={LibraryTorrefactionPage} />
          <Route path="/library/v60" component={LibraryV60Page} />
          <Route path="/library/chemex" component={LibraryChemexPage} />
          <Route path="/ateliers" component={AteliersPage} />
          <Route path="/ateliers-enfants" component={AteliersEnfantsPage} />
          <Route path="/ateliers-domicile" component={AteliersDomicilePage} />
          <Route path="/ateliers-team-building" component={AteliersTeamBuildingPage} />
          <Route path="/ateliers-cafe-tech" component={AteliersCafeTechPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <MobileNav />
    </div>
  );
}

function PublicLayout() {
  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <AppHeader publicMode />
      <main className="flex-1 overflow-y-auto overscroll-contain pb-[72px] md:pb-4">
        <Switch>
          <Route path="/play" component={PlayIndex} />
          <Route path="/play/quiz" component={PlayQuiz} />
          <Route path="/play/ordem" component={PlayOrdem} />
          <Route path="/quiz"><Redirect to="/play/quiz" /></Route>
          <Route path="/library" component={LibraryPage} />
          <Route path="/library/torrefaction" component={LibraryTorrefactionPage} />
          <Route path="/library/v60" component={LibraryV60Page} />
          <Route path="/library/chemex" component={LibraryChemexPage} />
          <Route path="/ateliers" component={AteliersPage} />
          <Route path="/ateliers-enfants" component={AteliersEnfantsPage} />
          <Route path="/ateliers-domicile" component={AteliersDomicilePage} />
          <Route path="/ateliers-team-building" component={AteliersTeamBuildingPage} />
          <Route path="/ateliers-cafe-tech" component={AteliersCafeTechPage} />
        </Switch>
      </main>
      <MobileNav publicMode />
    </div>
  );
}

function WelcomeScreen({ name, onDone }: { name: string; onDone: () => void }) {
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(onDone, 1800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-background">
      <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
        <img src={logoIcon} alt="O Baristech" className="h-20 w-20 mx-auto block dark:hidden" />
        <img src={logoIconWhite} alt="O Baristech" className="h-20 w-20 mx-auto hidden dark:block" />
        <div className="space-y-1">
          <h2 className="font-sans text-2xl font-semibold" data-testid="text-welcome-title">
            {t("app.welcome.title")}
          </h2>
          <p className="text-muted-foreground" data-testid="text-welcome-name">{name}</p>
        </div>
        <p className="text-sm text-muted-foreground">{t("app.welcome.subtitle")}</p>
      </div>
    </div>
  );
}

function UserApp() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [prevUser, setPrevUser] = useState<typeof user>(null);

  useEffect(() => {
    if (user && !prevUser && !isLoading) {
      const hasSeenWelcome = sessionStorage.getItem("baristech_welcome_shown");
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        sessionStorage.setItem("baristech_welcome_shown", "1");
      }
    }
    setPrevUser(user);
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-background">
        <div className="space-y-4 text-center animate-pulse">
          <img src={logoIcon} alt="O Baristech" className="h-16 w-16 mx-auto block dark:hidden" />
          <img src={logoIconWhite} alt="O Baristech" className="h-16 w-16 mx-auto hidden dark:block" />
          <p className="font-sans text-lg font-semibold text-foreground/70">O Baristech</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (PUBLIC_ROUTES.includes(location)) {
      return <PublicLayout />;
    }
    return <LandingPage />;
  }

  if (showWelcome) {
    return <WelcomeScreen name={user.firstName || user.email || ""} onDone={() => setShowWelcome(false)} />;
  }

  if (location === "/") {
    return <LandingPage />;
  }

  return <AuthenticatedLayout />;
}

function AppContent() {
  const [location] = useLocation();

  if (location === "/admin-panel") {
    return <AdminDashboardPage />;
  }

  return <UserApp />;
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
