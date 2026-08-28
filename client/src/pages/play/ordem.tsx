import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { ORDEM_METHODS } from "@/lib/play/ordem-data";
import { useSubmitPlaySession } from "@/hooks/use-submit-play-session";
import { GraosCelebration } from "@/components/play/graos-celebration";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp, ArrowDown, CheckCircle, XCircle } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PlayOrdem() {
  const { t, lang } = useI18n();
  const { submit, celebration, dismiss } = useSubmitPlaySession();
  const method = ORDEM_METHODS[0]; // V60 nesta fase

  // ordem correta = índice original 0..n-1
  const correctOrder = useMemo(() => method.steps.map((_, i) => i), [method]);
  const [order, setOrder] = useState<number[]>(() => {
    let s = shuffle(correctOrder);
    // garante que não começa já resolvido
    if (s.every((v, i) => v === i)) s = shuffle(correctOrder);
    return s;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);

  const isCorrectAt = (pos: number) => order[pos] === correctOrder[pos];

  const tapStep = (pos: number) => {
    if (solved) return;
    setChecked(false);
    if (selected === null) {
      setSelected(pos);
    } else if (selected === pos) {
      setSelected(null);
    } else {
      const next = [...order];
      [next[selected], next[pos]] = [next[pos], next[selected]];
      setOrder(next);
      setSelected(null);
    }
  };

  const move = (pos: number, dir: -1 | 1) => {
    if (solved) return;
    const target = pos + dir;
    if (target < 0 || target >= order.length) return;
    setChecked(false);
    const next = [...order];
    [next[pos], next[target]] = [next[target], next[pos]];
    setOrder(next);
    setSelected(null);
  };

  const handleCheck = () => {
    const attemptNumber = attempts + 1;
    setAttempts(attemptNumber);
    setChecked(true);
    const correctCount = order.filter((_, pos) => isCorrectAt(pos)).length;
    if (correctCount === order.length) {
      setSolved(true);
      submit({
        gameKey: "ordem-v60",
        correct: order.length,
        total: order.length,
        firstTry: attemptNumber === 1,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <GraosCelebration outcome={celebration} onDismiss={dismiss} />

      <div className="px-5 pt-4 pb-2">
        <Button variant="ghost" size="sm" asChild data-testid="button-ordem-back">
          <Link href="/play"><ArrowLeft className="h-4 w-4 mr-1" /> {t("play.ordem.backToPlay")}</Link>
        </Button>
      </div>

      <div className="px-5 pb-3">
        <h1 className="font-serif text-lg font-semibold">
          {t("play.ordem.title")} — {t(method.nameKey)}
        </h1>
        <p className="text-sm text-muted-foreground">{t("play.ordem.instruction")}</p>
      </div>

      <div className="flex-1 px-5 space-y-2 pb-4">
        {order.map((stepIdx, pos) => {
          const step = method.steps[stepIdx];
          const showResult = checked;
          const ok = isCorrectAt(pos);
          let cls = "p-3 border transition-colors flex items-center gap-2";
          if (selected === pos) cls += " border-primary bg-primary/5";
          else if (showResult && ok) cls += " border-green-500 bg-green-500/5";
          else if (showResult && !ok) cls += " border-red-500 bg-red-500/5";

          return (
            <Card key={stepIdx} className={cls} data-testid={`ordem-step-${pos}`}>
              <button
                type="button"
                className="flex-1 text-left text-sm"
                onClick={() => tapStep(pos)}
                data-testid={`ordem-step-tap-${pos}`}
              >
                {step[lang]}
              </button>
              {showResult && ok && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
              {showResult && !ok && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label={t("play.ordem.moveUp")}
                  className="p-1 text-muted-foreground disabled:opacity-30"
                  disabled={pos === 0 || solved}
                  onClick={() => move(pos, -1)}
                  data-testid={`ordem-up-${pos}`}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={t("play.ordem.moveDown")}
                  className="p-1 text-muted-foreground disabled:opacity-30"
                  disabled={pos === order.length - 1 || solved}
                  onClick={() => move(pos, 1)}
                  data-testid={`ordem-down-${pos}`}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          );
        })}

        {checked && (
          <div
            className={`p-3 rounded-md text-sm ${solved ? "bg-green-500/10 text-green-700 dark:text-green-300" : "bg-red-500/10 text-red-700 dark:text-red-300"}`}
            data-testid="ordem-feedback"
          >
            {solved ? t("play.ordem.done") : t("play.ordem.someWrong")}
          </div>
        )}

        {!solved && (
          <Button className="w-full" onClick={handleCheck} data-testid="button-ordem-check">
            {t("play.ordem.check")}
          </Button>
        )}
      </div>
    </div>
  );
}
