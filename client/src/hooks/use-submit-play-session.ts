import { useState, useCallback } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import type { GameKey } from "@shared/play/graos";

export interface PlaySessionOutcome {
  totalGraos: number;
  level: { key: string; min: number; next: number | null };
  currentStreak: number;
  badges: string[];
  graosEarned: number;
  leveledUp: boolean;
  newBadges: string[];
}

interface SubmitInput {
  gameKey: GameKey;
  correct: number;
  total: number;
  firstTry: boolean;
}

export function useSubmitPlaySession() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const [celebration, setCelebration] = useState<
    { leveledUp: boolean; levelKey: string; newBadges: string[] } | null
  >(null);

  const submit = useCallback(
    async (input: SubmitInput): Promise<PlaySessionOutcome | null> => {
      if (!user) return null;
      try {
        const res = await apiRequest("POST", "/api/play/session", input);
        const outcome: PlaySessionOutcome = await res.json();
        queryClient.invalidateQueries({ queryKey: ["/api/play/progress"] });
        if (outcome.graosEarned > 0) {
          toast({ description: t("play.graos.earned").replace("{n}", String(outcome.graosEarned)) });
        } else {
          toast({ description: t("play.graos.capReached") });
        }
        if (outcome.leveledUp || outcome.newBadges.length > 0) {
          setCelebration({
            leveledUp: outcome.leveledUp,
            levelKey: outcome.level.key,
            newBadges: outcome.newBadges,
          });
        }
        return outcome;
      } catch (err) {
        console.error("play session submit failed", err);
        return null;
      }
    },
    [user, toast, t],
  );

  return { submit, celebration, dismiss: () => setCelebration(null) };
}
