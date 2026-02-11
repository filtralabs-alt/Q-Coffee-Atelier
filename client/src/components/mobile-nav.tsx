import { useLocation, Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Coffee, BookOpen, Map, HelpCircle, BarChart3 } from "lucide-react";

export function MobileNav() {
  const { t } = useI18n();
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Coffee, label: t("nav.journal") },
    { href: "/summary", icon: BarChart3, label: t("nav.summary") },
    { href: "/spots", icon: Map, label: t("nav.spots") },
    { href: "/quiz", icon: HelpCircle, label: t("nav.quiz") },
    { href: "/library", icon: BookOpen, label: t("nav.library") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t" data-testid="mobile-nav">
      <div className="flex items-stretch justify-around gap-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-link-${item.href.replace("/", "") || "home"}`}
              className="flex-1"
            >
              <div className={`flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] relative transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
                )}
                <item.icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] leading-tight ${isActive ? "font-semibold" : "font-medium"}`}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="safe-area-bottom" />
    </nav>
  );
}
