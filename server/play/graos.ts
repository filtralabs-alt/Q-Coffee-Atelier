import {
  graosForGame,
  applyDailyCap,
  levelForGraos,
  nextStreak,
  computeBadges,
  GAME_KEYS,
  type GameKey,
} from "@shared/play/graos";

export interface PlayStore {
  getPlayProgress(userId: string): Promise<
    | { totalGraos: number; currentStreak: number; lastPlayedDate: string | null; badges: string[] }
    | undefined
  >;
  upsertPlayProgress(
    userId: string,
    data: { totalGraos: number; currentStreak: number; lastPlayedDate: string; badges: string[] },
  ): Promise<unknown>;
  createPlaySession(data: {
    userId: string;
    gameKey: string;
    graosEarned: number;
    correct: number;
    total: number;
  }): Promise<unknown>;
  getTodayGraosEarned(userId: string, date: string): Promise<number>;
}

export interface PlaySessionInput {
  gameKey: GameKey;
  correct: number;
  total: number;
  firstTry: boolean;
}

export interface PlaySessionResult {
  totalGraos: number;
  level: { key: string; min: number; next: number | null };
  currentStreak: number;
  badges: string[];
  graosEarned: number;
  leveledUp: boolean;
  newBadges: string[];
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function applyPlaySession(
  store: PlayStore,
  userId: string,
  input: PlaySessionInput,
  today: string = todayISO(),
): Promise<PlaySessionResult> {
  if (!GAME_KEYS.includes(input.gameKey)) {
    throw new Error(`invalid gameKey: ${input.gameKey}`);
  }
  const total = Math.max(0, Math.floor(input.total));
  const clampedCorrect = Math.min(Math.max(0, Math.floor(input.correct)), total);

  const prev = await store.getPlayProgress(userId);
  const isFirstGame = !prev;
  const prevTotal = prev?.totalGraos ?? 0;
  const prevBadges = prev?.badges ?? [];

  const raw = graosForGame(input.gameKey, clampedCorrect, input.firstTry);
  const earnedToday = await store.getTodayGraosEarned(userId, today);
  const graosEarned = applyDailyCap(raw, earnedToday);
  const newTotal = prevTotal + graosEarned;

  const currentStreak = nextStreak(prev?.lastPlayedDate ?? null, today, prev?.currentStreak ?? 0);

  // Deliberate order: log the session BEFORE advancing progress. If the
  // upsert throws, the session row still counts against the daily cap, so a
  // retried request can't farm Grãos. The reverse order would let a failed
  // createPlaySession advance the total without a cap-accounting row.
  await store.createPlaySession({
    userId,
    gameKey: input.gameKey,
    graosEarned,
    correct: clampedCorrect,
    total,
  });

  const badges = computeBadges(prevBadges, {
    gameKey: input.gameKey,
    correct: clampedCorrect,
    total,
    firstTry: input.firstTry,
    streak: currentStreak,
    isFirstGame,
  });

  await store.upsertPlayProgress(userId, {
    totalGraos: newTotal,
    currentStreak,
    lastPlayedDate: today,
    badges,
  });

  const prevLevel = levelForGraos(prevTotal);
  const level = levelForGraos(newTotal);

  return {
    totalGraos: newTotal,
    level,
    currentStreak,
    badges,
    graosEarned,
    leveledUp: level.key !== prevLevel.key,
    newBadges: badges.filter((b) => !prevBadges.includes(b)),
  };
}
