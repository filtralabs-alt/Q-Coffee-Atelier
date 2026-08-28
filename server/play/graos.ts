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
  const correct = Math.max(0, Math.floor(input.correct));
  const total = Math.max(0, Math.floor(input.total));

  const prev = await store.getPlayProgress(userId);
  const isFirstGame = !prev;
  const prevTotal = prev?.totalGraos ?? 0;
  const prevBadges = prev?.badges ?? [];

  const raw = graosForGame(input.gameKey, correct, input.firstTry);
  const earnedToday = await store.getTodayGraosEarned(userId, today);
  const graosEarned = applyDailyCap(raw, earnedToday);
  const newTotal = prevTotal + graosEarned;

  const currentStreak = nextStreak(prev?.lastPlayedDate ?? null, today, prev?.currentStreak ?? 0);

  await store.createPlaySession({
    userId,
    gameKey: input.gameKey,
    graosEarned,
    correct,
    total,
  });

  const badges = computeBadges(prevBadges, {
    gameKey: input.gameKey,
    correct,
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
