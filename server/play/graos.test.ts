import { describe, it, expect } from "vitest";
import { applyPlaySession, type PlayStore } from "./graos";

function makeStore(initial?: Partial<{ totalGraos: number; currentStreak: number; lastPlayedDate: string | null; badges: string[] }>, todayEarned = 0): PlayStore & { progress: any; sessions: any[] } {
  const store = {
    progress: initial
      ? { totalGraos: 0, currentStreak: 0, lastPlayedDate: null, badges: [], ...initial }
      : undefined,
    sessions: [] as any[],
    async getPlayProgress() {
      return store.progress;
    },
    async upsertPlayProgress(_userId: string, data: any) {
      store.progress = { ...(store.progress ?? {}), ...data };
      return store.progress;
    },
    async createPlaySession(data: any) {
      store.sessions.push(data);
      return data;
    },
    async getTodayGraosEarned() {
      return todayEarned;
    },
  };
  return store;
}

describe("applyPlaySession", () => {
  it("primeira partida: cria progresso, ganha Graos, badge first-game, streak 1", async () => {
    const store = makeStore();
    const r = await applyPlaySession(store, "u1", { gameKey: "quiz-basic", correct: 5, total: 10, firstTry: false }, "2026-08-28");
    expect(r.graosEarned).toBe(5);
    expect(r.totalGraos).toBe(5);
    expect(r.currentStreak).toBe(1);
    expect(r.badges).toContain("first-game");
    expect(r.newBadges).toContain("first-game");
    expect(store.sessions).toHaveLength(1);
    expect(store.sessions[0].graosEarned).toBe(5);
  });

  it("aplica o teto diario", async () => {
    const store = makeStore({ totalGraos: 200 }, 140);
    const r = await applyPlaySession(store, "u1", { gameKey: "quiz-advanced", correct: 10, total: 10, firstTry: false }, "2026-08-28");
    expect(r.graosEarned).toBe(10); // 30 bruto, mas só 10 restam no teto
    expect(r.totalGraos).toBe(210);
  });

  it("detecta level up", async () => {
    const store = makeStore({ totalGraos: 95, currentStreak: 1, lastPlayedDate: "2026-08-27", badges: ["first-game"] });
    const r = await applyPlaySession(store, "u1", { gameKey: "quiz-basic", correct: 10, total: 10, firstTry: false }, "2026-08-28");
    expect(r.leveledUp).toBe(true);
    expect(r.level.key).toBe("broto");
  });

  it("nao dá level up quando fica no mesmo nivel", async () => {
    const store = makeStore({ totalGraos: 5, currentStreak: 1, lastPlayedDate: "2026-08-27", badges: ["first-game"] });
    const r = await applyPlaySession(store, "u1", { gameKey: "quiz-basic", correct: 3, total: 10, firstTry: false }, "2026-08-28");
    expect(r.leveledUp).toBe(false);
  });

  it("mesma data nao incrementa streak", async () => {
    const store = makeStore({ totalGraos: 20, currentStreak: 4, lastPlayedDate: "2026-08-28", badges: ["first-game"] });
    const r = await applyPlaySession(store, "u1", { gameKey: "quiz-basic", correct: 2, total: 10, firstTry: false }, "2026-08-28");
    expect(r.currentStreak).toBe(4);
  });

  it("rejeita gameKey invalido", async () => {
    const store = makeStore();
    await expect(
      applyPlaySession(store, "u1", { gameKey: "hack" as any, correct: 5, total: 10, firstTry: false }, "2026-08-28"),
    ).rejects.toThrow();
  });
});
