import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles } from "lucide-react";

interface Props {
  outcome: { leveledUp: boolean; levelKey: string; newBadges: string[] } | null;
  onDismiss: () => void;
}

export function GraosCelebration({ outcome, onDismiss }: Props) {
  const { t } = useI18n();
  return (
    <AnimatePresence>
      {outcome && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          data-testid="graos-celebration"
        >
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}>
            <Card className="p-6 text-center max-w-xs w-full space-y-3">
              <Trophy className="h-14 w-14 mx-auto text-amber-500" />
              {outcome.leveledUp && (
                <div>
                  <h3 className="font-semibold text-lg">{t("play.graos.levelUp")}</h3>
                  <p className="text-primary font-bold">{t(`play.level.${outcome.levelKey}`)}</p>
                </div>
              )}
              {outcome.newBadges.map((b) => (
                <p key={b} className="flex items-center justify-center gap-1.5 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" /> {t("play.graos.newBadge")}: {t(`play.badge.${b}`)}
                </p>
              ))}
              <Button className="w-full" onClick={onDismiss}>OK</Button>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
