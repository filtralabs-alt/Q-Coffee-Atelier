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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t safe-area-bottom" data-testid="mobile-nav">
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-link-${item.href.replace("/", "") || "home"}`}
            >
              <div className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
