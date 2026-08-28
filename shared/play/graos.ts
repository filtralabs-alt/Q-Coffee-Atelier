export type GameKey = "quiz-basic" | "quiz-intermediate" | "quiz-advanced" | "ordem-v60";

export const GAME_KEYS: readonly GameKey[] = [
  "quiz-basic",
  "quiz-intermediate",
  "quiz-advanced",
  "ordem-v60",
];

export const GRAOS_DAILY_CAP = 150;

export function graosForGame(gameKey: GameKey, correct: number, firstTry: boolean): number {
  const safe = Math.max(0, Math.floor(correct));
  switch (gameKey) {
    case "quiz-basic":
      return safe * 1;
    case "quiz-intermediate":
      return safe * 2;
    case "quiz-advanced":
      return safe * 3;
    case "ordem-v60":
      return safe * (firstTry ? 2 : 1);
  }
}

export function applyDailyCap(earned: number, alreadyEarnedToday: number): number {
  const remaining = Math.max(0, GRAOS_DAILY_CAP - alreadyEarnedToday);
  return Math.max(0, Math.min(earned, remaining));
}

export const GRAOS_LEVELS = [
  { key: "semente", min: 0 },
  { key: "broto", min: 100 },
  { key: "barista", min: 300 },
  { key: "barista-senior", min: 700 },
  { key: "mestre", min: 1500 },
] as const;

export function levelForGraos(total: number): { key: string; min: number; next: number | null } {
  let current: { key: string; min: number } = GRAOS_LEVELS[0];
  for (const level of GRAOS_LEVELS) {
    if (total >= level.min) current = level;
  }
  const idx = GRAOS_LEVELS.findIndex((l) => l.key === current.key);
  const next = idx < GRAOS_LEVELS.length - 1 ? GRAOS_LEVELS[idx + 1].min : null;
  return { key: current.key, min: current.min, next };
}

function daysBetween(a: string, b: string): number {
  const da = Date.parse(`${a}T00:00:00Z`);
  const db = Date.parse(`${b}T00:00:00Z`);
  return Math.round((db - da) / 86_400_000);
}

export function nextStreak(lastPlayedDate: string | null, today: string, current: number): number {
  if (!lastPlayedDate) return 1;
  const gap = daysBetween(lastPlayedDate, today);
  if (gap <= 0) return current;
  if (gap === 1) return current + 1;
  return 1;
}

export const ALL_BADGES = ["first-game", "quiz-perfect", "ordem-v60-clean", "streak-7"] as const;
export type Badge = (typeof ALL_BADGES)[number];

export interface BadgeContext {
  gameKey: GameKey;
  correct: number;
  total: number;
  firstTry: boolean;
  streak: number;
  isFirstGame: boolean;
}

export function computeBadges(existing: string[], ctx: BadgeContext): string[] {
  const set = new Set(existing);
  if (ctx.isFirstGame) set.add("first-game");
  if (ctx.gameKey.startsWith("quiz-") && ctx.total > 0 && ctx.correct === ctx.total) {
    set.add("quiz-perfect");
  }
  if (ctx.gameKey === "ordem-v60" && ctx.firstTry) set.add("ordem-v60-clean");
  if (ctx.streak >= 7) set.add("streak-7");
  return Array.from(set);
}
