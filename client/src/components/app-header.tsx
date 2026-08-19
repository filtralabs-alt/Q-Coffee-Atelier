import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { useNavItems } from "@/hooks/use-nav-items";
import { useLocation, Link } from "wouter";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, Settings, User } from "lucide-react";
import logoIcon from "@assets/baristech-icon.png";
import logoIconWhite from "@assets/baristech-icon-white.png";

export function AppHeader({ publicMode = false }: { publicMode?: boolean }) {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [location] = useLocation();
  const navItems = useNavItems(publicMode);

  const initials = user
    ? (
        `${(user.firstName || "")[0] || ""}${(user.lastName || "")[0] || ""}`.toUpperCase() ||
        (user.email || "U")[0].toUpperCase()
      )
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-4 px-5 h-14">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2.5 shrink-0">
            <img src={logoIcon} alt="Baristech" className="h-7 w-7 block dark:hidden" data-testid="img-header-logo" />
            <img src={logoIconWhite} alt="Baristech" className="h-7 w-7 hidden dark:block" data-testid="img-header-logo-dark" />
            <span className="font-sans text-lg font-semibold tracking-tight">{t("app.name")}</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5" data-testid="desktop-nav">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} data-testid={`desktop-nav-link-${item.href.replace("/", "") || "home"}`}>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 1.5} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 ml-auto">
          <LangToggle />
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || ""} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2" data-testid="link-profile">
                    <User className="h-4 w-4" />
                    {t("nav.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin-panel" className="flex items-center gap-2" data-testid="link-admin">
                    <Settings className="h-4 w-4" />
                    {t("nav.admin")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  data-testid="button-logout"
                  onSelect={() => logout()}
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" data-testid="button-header-login">
              <Link href="/">
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                {t("nav.login")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
