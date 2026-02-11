import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coffee, BookOpen, Award, ExternalLink, ShieldCheck } from "lucide-react";
import logoFull from "@assets/cris-du-cafe-logo.png";
import logoIcon from "@assets/cris-du-cafe-icon.png";

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="Cris Du Café" className="h-8 w-8" data-testid="img-logo-header" />
            <span className="font-serif text-lg font-bold tracking-tight">{t("app.name")}</span>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
            <Button asChild data-testid="button-login-header">
              <a href="/api/login">
                <ShieldCheck className="mr-1.5 h-4 w-4" />
                {t("app.login.secure")}
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:to-primary/5" />
          <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex justify-center lg:hidden mb-4">
                  <img
                    src={logoFull}
                    alt="Cris Du Café"
                    className="w-48"
                    data-testid="img-logo-hero-mobile"
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Coffee className="h-3.5 w-3.5" />
                  <span>Atelier de Dégustation</span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  {t("app.hero.title")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                  {t("app.hero.subtitle")}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" asChild data-testid="button-hero-cta">
                    <a href="/api/login">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      {t("app.hero.cta")}
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild data-testid="button-hero-qcoffee">
                    <a href="https://qcoffeego.com" target="_blank" rel="noopener noreferrer">
                      Q Coffee Go <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <p className="flex items-center gap-2 text-xs text-muted-foreground pt-1" data-testid="text-login-hint">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0" />
                  {t("app.login.redirect")}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Clermont-Ferrand
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    FR / PT-BR
                  </span>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center">
                <img
                  src={logoFull}
                  alt="Cris Du Café"
                  className="max-w-xs w-full"
                  data-testid="img-logo-hero"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Coffee, titleKey: "app.hero.feature1.title", descKey: "app.hero.feature1.desc" },
              { icon: Award, titleKey: "app.hero.feature2.title", descKey: "app.hero.feature2.desc" },
              { icon: BookOpen, titleKey: "app.hero.feature3.title", descKey: "app.hero.feature3.desc" },
            ].map((feature) => (
              <Card key={feature.titleKey} className="p-6 hover-elevate">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cris Du Café. Clermont-Ferrand, France.</p>
        </div>
      </footer>
    </div>
  );
}
