import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sprout, Flame, LogIn } from "lucide-react";

interface ProgressResponse {
  totalGraos: number;
  level: { key: string; min: number; next: number | null };
  currentStreak: number;
  badges: string[];
}

export function GraosBar() {
  const { user } = useAuth();
  const { t } = useI18n();

  const { data } = useQuery<ProgressResponse>({
    queryKey: ["/api/play/progress"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <Card className="p-4 bg-primary/5 border-primary/20 flex items-center gap-2" data-testid="graos-bar-login">
        <LogIn className="h-4 w-4 text-primary flex-shrink-0" />
        <p className="text-xs text-muted-foreground">{t("play.graos.loginCta")}</p>
      </Card>
    );
  }

  if (!data) return null;

  const { totalGraos, level, currentStreak, badges } = data;
  const span = level.next !== null ? level.next - level.min : 0;
  const done = level.next !== null ? totalGraos - level.min : 1;
  const pct = level.next !== null && span > 0 ? Math.min(100, (done / span) * 100) : 100;

  return (
    <Card className="p-4 space-y-2" data-testid="graos-bar">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{t(`play.level.${level.key}`)}</span>
        </div>
        <div className="flex items-center gap-3">
          {currentStreak > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-amber-500" /> {currentStreak} {t("play.graos.streak")}
            </span>
          )}
          <span className="text-sm font-bold text-primary" data-testid="graos-total">
            {totalGraos} {t("play.graos.unit")}
          </span>
        </div>
      </div>
      <Progress value={pct} className="h-1.5" />
      <p className="text-[10px] text-muted-foreground">
        {level.next !== null
          ? `${level.next - totalGraos} ${t("play.graos.unit")} ${t("play.graos.toNext")}`
          : t("play.graos.maxLevel")}
      </p>
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {badges.slice(-3).map((b) => (
            <Badge key={b} variant="secondary" className="text-[10px]">
              {t(`play.badge.${b}`)}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
