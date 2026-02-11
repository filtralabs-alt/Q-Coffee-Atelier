import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { quizQuestions, type QuizQuestion } from "@/lib/quiz-data";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw, ArrowLeft, Star } from "lucide-react";

type Level = "basic" | "intermediate" | "advanced";

export default function QuizPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const saveResult = useMutation({
    mutationFn: async (data: { level: string; score: number; totalQuestions: number }) => {
      if (user) {
        await apiRequest("POST", "/api/quiz-results", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quiz-results"] });
    },
  });

  const levels: { key: Level; label: string; color: string; stars: number }[] = [
    { key: "basic", label: t("quiz.basic"), color: "bg-green-500/10 text-green-600 dark:text-green-400", stars: 1 },
    { key: "intermediate", label: t("quiz.intermediate"), color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", stars: 2 },
    { key: "advanced", label: t("quiz.advanced"), color: "bg-red-500/10 text-red-600 dark:text-red-400", stars: 3 },
  ];

  const getBadge = (pct: number) => {
    if (pct >= 90) return t("quiz.badge.master");
    if (pct >= 70) return t("quiz.badge.expert");
    if (pct >= 50) return t("quiz.badge.amateur");
    return t("quiz.badge.novice");
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const questions = quizQuestions[selectedLevel!];
    if (idx === questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    const questions = quizQuestions[selectedLevel!];
    if (currentQ + 1 >= questions.length) {
      const finalScore = score;
      setFinished(true);
      saveResult.mutate({ level: selectedLevel!, score: finalScore, totalQuestions: questions.length });
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
    }
  };

  const reset = () => {
    setSelectedLevel(null);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  if (!selectedLevel) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="px-5 pt-5 pb-4">
          <h1 className="font-serif text-xl font-semibold" data-testid="text-quiz-title">{t("quiz.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("quiz.subtitle")}</p>
        </div>
        <div className="flex-1 px-5 space-y-3 pb-4">
          {levels.map((level) => (
            <Card
              key={level.key}
              className="p-6 hover-elevate cursor-pointer active-elevate-2"
              onClick={() => setSelectedLevel(level.key)}
              data-testid={`card-quiz-${level.key}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-md flex items-center justify-center ${level.color}`}>
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{level.label}</h3>
                    <p className="text-xs text-muted-foreground">10 {t("quiz.questions")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: level.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                  {Array.from({ length: 3 - level.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-muted" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const questions = quizQuestions[selectedLevel];
  const question = questions[currentQ];
  const pct = ((currentQ + (finished ? 1 : 0)) / questions.length) * 100;

  if (finished) {
    const scorePct = (score / questions.length) * 100;
    const badge = getBadge(scorePct);
    return (
      <div className="flex flex-col min-h-full">
        <div className="px-5 pt-4 pb-2">
          <Button variant="ghost" size="sm" onClick={reset} data-testid="button-quiz-back">
            <ArrowLeft className="h-4 w-4 mr-1" /> {t("quiz.back")}
          </Button>
        </div>
        <div className="flex-1 px-5 flex items-center justify-center">
          <Card className="p-6 text-center max-w-sm mx-auto w-full" data-testid="card-quiz-result">
            <div className="space-y-4">
              <Trophy className={`h-16 w-16 mx-auto ${scorePct >= 70 ? "text-amber-500" : "text-muted-foreground"}`} />
              <h2 className="font-serif text-2xl font-semibold">{t("quiz.score")}</h2>
              <div className="text-4xl font-bold text-primary" data-testid="text-quiz-score">{score}/{questions.length}</div>
              <Badge variant="secondary" className="text-sm px-3 py-1" data-testid="text-quiz-badge">{badge}</Badge>
              <Button onClick={reset} className="w-full mt-4" data-testid="button-quiz-retry">
                <RotateCcw className="h-4 w-4 mr-1.5" /> {t("quiz.retry")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-4 pb-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={reset} data-testid="button-quiz-back-to-levels">
            <ArrowLeft className="h-4 w-4 mr-1" /> {t("quiz.back")}
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            {t("quiz.question")} {currentQ + 1} {t("quiz.of")} {questions.length}
          </span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>

      <div className="flex-1 px-5 space-y-3 pb-4">
        <Card className="p-5" data-testid="card-quiz-question">
          <h3 className="font-semibold text-base mb-4 leading-relaxed" data-testid="text-quiz-question">
            {question.question[lang]}
          </h3>
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === question.correctIndex;
              const showResult = selectedAnswer !== null;

              let cardClass = "p-3 cursor-pointer border transition-colors";
              if (showResult && isCorrect) {
                cardClass += " border-green-500 bg-green-500/5";
              } else if (showResult && isSelected && !isCorrect) {
                cardClass += " border-red-500 bg-red-500/5";
              } else if (!showResult) {
                cardClass += " hover-elevate";
              }

              return (
                <Card
                  key={idx}
                  className={cardClass}
                  onClick={() => handleAnswer(idx)}
                  data-testid={`card-answer-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-sm">{opt[lang]}</div>
                    {showResult && isCorrect && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                  </div>
                </Card>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className={`mt-4 p-3 rounded-md text-sm ${selectedAnswer === question.correctIndex ? "bg-green-500/10 text-green-700 dark:text-green-300" : "bg-red-500/10 text-red-700 dark:text-red-300"}`} data-testid="text-quiz-explanation">
              <p className="font-medium mb-1">
                {selectedAnswer === question.correctIndex ? t("quiz.correct") : t("quiz.incorrect")}
              </p>
              <p className="text-xs leading-relaxed opacity-90">{question.explanation[lang]}</p>
            </div>
          )}
        </Card>

        {selectedAnswer !== null && (
          <Button onClick={handleNext} className="w-full" data-testid="button-quiz-next">
            {currentQ + 1 >= questions.length ? t("quiz.finish") : t("quiz.next")}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
