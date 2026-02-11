import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Coffee, BookOpen, Award, ExternalLink, ArrowRight, LogIn } from "lucide-react";
import logoIcon from "@assets/cris-du-cafe-icon.png";

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <img src={logoIcon} alt="Cris Du Café" className="h-7 w-7" data-testid="img-logo-header" />
            <span className="font-serif text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap">{t("app.name")}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LangToggle />
            <ThemeToggle />
            <Button size="sm" asChild className="hidden sm:inline-flex" data-testid="button-login-header">
              <a href="/api/login">
                {t("nav.login")}
              </a>
            </Button>
            <Button size="icon" asChild className="sm:hidden" data-testid="button-login-header-mobile">
              <a href="/api/login">
                <LogIn className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-28 pb-16 sm:pt-40 sm:pb-28">
          <div className="max-w-5xl mx-auto px-5">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="flex justify-center">
                <img
                  src={logoIcon}
                  alt="Cris Du Café"
                  className="h-16 w-16"
                  data-testid="img-logo-hero-mobile"
                />
              </div>
              <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]" data-testid="text-hero-title">
                {t("app.hero.title")}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {t("app.hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button size="lg" asChild className="w-full sm:w-auto" data-testid="button-hero-cta">
                  <a href="/api/login">
                    {t("app.hero.cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto" data-testid="button-hero-qcoffee">
                  <a href="https://qcoffeego.com" target="_blank" rel="noopener noreferrer">
                    Q Coffee Go <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Clermont-Ferrand
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  FR / PT-BR
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-5">
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { icon: Coffee, titleKey: "app.hero.feature1.title", descKey: "app.hero.feature1.desc" },
                { icon: Award, titleKey: "app.hero.feature2.title", descKey: "app.hero.feature2.desc" },
                { icon: BookOpen, titleKey: "app.hero.feature3.title", descKey: "app.hero.feature3.desc" },
              ].map((feature) => (
                <div key={feature.titleKey} className="p-6 rounded-md border border-border/60 hover-elevate">
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-md bg-primary/8 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">{t(feature.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50">
        <div className="max-w-5xl mx-auto px-5 py-10 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cris Du Café &middot; Clermont-Ferrand, France</p>
        </div>
      </footer>
    </div>
  );
}
