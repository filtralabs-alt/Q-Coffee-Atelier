import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coffee, BookOpen, Award } from "lucide-react";
import logoIcon from "@assets/baristech-icon.png";
import logoIconWhite from "@assets/baristech-icon-white.png";
import logoFull from "@assets/baristech-logo-full.png";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { t } = useI18n();
  const { identify, isIdentifying } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [consentGiven, setConsentGiven] = useState(() =>
    localStorage.getItem("baristech_privacy_consent") === "1"
  );

  const handleAccept = () => {
    localStorage.setItem("baristech_privacy_consent", "1");
    setConsentGiven(true);
  };

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setError("");

    try {
      await identify({ name: name.trim(), email: email.trim() });
    } catch (err: any) {
      setError(err?.message ?? "Error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <img src={logoIcon} alt="O Baristech" className="h-7 w-7 block dark:hidden" data-testid="img-logo-header" />
            <img src={logoIconWhite} alt="O Baristech" className="h-7 w-7 hidden dark:block" data-testid="img-logo-header-dark" />
            <span className="font-sans text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap">{t("app.name")}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="pt-28 pb-16 sm:pt-40 sm:pb-28">
          <div className="max-w-5xl mx-auto px-5">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="flex justify-center">
                <img
                  src={logoFull}
                  alt="O Baristech"
                  className="h-28 w-auto"
                  data-testid="img-logo-hero-mobile"
                />
              </div>
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]" data-testid="text-hero-title">
                {t("app.hero.title")}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {t("app.hero.subtitle")}
              </p>

              {/* Login form */}
              <div className="max-w-sm mx-auto pt-2">
                <form onSubmit={handleIdentify} className="flex flex-col gap-3">
                  <Input
                    type="text"
                    placeholder={t("profile.firstName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    data-testid="input-name"
                  />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                  />
                  <Button type="submit" disabled={isIdentifying} data-testid="button-hero-cta">
                    {isIdentifying ? <span className="animate-spin">⏳</span> : t("app.hero.cta")}
                  </Button>
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                </form>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
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
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
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

      <footer className="border-t border-border/50 pb-[72px]">
        <div className="max-w-5xl mx-auto px-5 py-10 text-center text-sm text-muted-foreground space-y-2">
          <p>&copy; {new Date().getFullYear()} Baristech &middot; Clermont-Ferrand, France</p>
          <p>
            <button
              onClick={() => setShowPrivacy(true)}
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              {t("privacy.link")}
            </button>
          </p>
        </div>
      </footer>

      {!consentGiven && (
        <div className="fixed bottom-[72px] left-0 right-0 z-50 bg-background border-t border-border/60 px-5 py-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground">
            <p className="text-center sm:text-left flex-1">
              {t("privacy.banner")}{" "}
              <button
                onClick={() => setShowPrivacy(true)}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                {t("privacy.link")}
              </button>
              .
            </p>
            <Button size="sm" onClick={handleAccept} className="shrink-0">
              {t("privacy.accept")}
            </Button>
          </div>
        </div>
      )}

      <MobileNav publicMode />

      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("privacy.title")}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">{t("privacy.updated")}</p>
          {[
            ["privacy.s1.title", "privacy.s1.body"],
            ["privacy.s2.title", "privacy.s2.body"],
            ["privacy.s3.title", "privacy.s3.body"],
            ["privacy.s4.title", "privacy.s4.body"],
            ["privacy.s5.title", "privacy.s5.body"],
          ].map(([titleKey, bodyKey]) => (
            <div key={titleKey} className="space-y-1">
              <h3 className="font-semibold text-sm">{t(titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(bodyKey)}</p>
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
