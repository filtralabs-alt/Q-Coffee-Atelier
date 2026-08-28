import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { PLAY_GAMES } from "@/lib/play/games";
import { GraosBar } from "@/components/play/graos-bar";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function PlayIndex() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-5 pb-4">
        <h1 className="font-serif text-xl font-semibold" data-testid="text-play-title">{t("play.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("play.subtitle")}</p>
      </div>

      <div className="px-5 pb-3">
        <GraosBar />
      </div>

      <div className="flex-1 px-5 space-y-3 pb-4">
        {PLAY_GAMES.map((game) => (
          <Link key={game.key} href={game.route} data-testid={`card-play-${game.key}`}>
            <Card className="p-5 hover-elevate cursor-pointer active-elevate-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-md flex items-center justify-center bg-primary/10 text-primary">
                    <game.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{t(game.titleKey)}</h3>
                    <p className="text-xs text-muted-foreground">{t(game.descKey)}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
