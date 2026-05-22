import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Link } from "wouter";
import logoIcon from "@assets/baristech-icon.png";
import logoIconWhite from "@assets/baristech-icon-white.png";

export function AppHeader() {
  const { user, logout } = useAuth();
  const { t } = useI18n();

  const initials = user
    ? (
        `${(user.firstName || "")[0] || ""}${(user.lastName || "")[0] || ""}`.toUpperCase() ||
        (user.email || "U")[0].toUpperCase()
      )
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between gap-2 px-5 h-14">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2.5">
            <img src={logoIcon} alt="Baristech" className="h-7 w-7 block dark:hidden" data-testid="img-header-logo" />
            <img src={logoIconWhite} alt="Baristech" className="h-7 w-7 hidden dark:block" data-testid="img-header-logo-dark" />
            <span className="font-sans text-lg font-semibold tracking-tight">{t("app.name")}</span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <LangToggle />
          <ThemeToggle />
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
        </div>
      </div>
    </header>
  );
}
