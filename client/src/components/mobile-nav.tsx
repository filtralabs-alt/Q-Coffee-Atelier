import { useLocation, Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Coffee, BookOpen, Map, HelpCircle, BarChart3, Calendar, LogIn } from "lucide-react";

export function MobileNav({ publicMode = false }: { publicMode?: boolean }) {
  const { t } = useI18n();
  const [location] = useLocation();

  const navItems = publicMode
    ? [
        { href: "/library", icon: BookOpen, label: t("nav.library") },
        { href: "/quiz", icon: HelpCircle, label: t("nav.quiz") },
        { href: "/ateliers", icon: Calendar, label: t("nav.ateliers") },
        { href: "/", icon: LogIn, label: t("nav.login") },
      ]
    : [
        { href: "/", icon: Coffee, label: t("nav.journal") },
        { href: "/summary", icon: BarChart3, label: t("nav.summary") },
        { href: "/ateliers", icon: Calendar, label: t("nav.ateliers") },
        { href: "/spots", icon: Map, label: t("nav.spots") },
        { href: "/library", icon: BookOpen, label: t("nav.library") },
        { href: "/quiz", icon: HelpCircle, label: t("nav.quiz") },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border/50" data-testid="mobile-nav">
      <div className="flex items-stretch justify-between px-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-link-${item.href.replace("/", "") || "home"}`}
            >
              <div className={`flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />
                )}
                <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] leading-tight ${isActive ? "font-semibold" : "font-normal"}`}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="safe-area-bottom" />
    </nav>
  );
}
