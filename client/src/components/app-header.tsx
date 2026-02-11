import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Coffee, LogOut, Settings } from "lucide-react";
import { Link } from "wouter";

export function AppHeader() {
  const { user } = useAuth();
  const { t } = useI18n();

  const initials = user
    ? `${(user.firstName || "")[0] || ""}${(user.lastName || "")[0] || ""}`.toUpperCase() || "U"
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            <span className="font-serif text-base font-bold tracking-tight">{t("app.name")}</span>
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
                <Link href="/admin" className="flex items-center gap-2" data-testid="link-admin">
                  <Settings className="h-4 w-4" />
                  {t("nav.admin")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/api/logout" className="flex items-center gap-2" data-testid="button-logout">
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
