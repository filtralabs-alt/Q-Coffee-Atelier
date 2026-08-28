import { describe, it, expect } from "vitest";
import {
  graosForGame,
  applyDailyCap,
  GRAOS_DAILY_CAP,
  levelForGraos,
  nextStreak,
  computeBadges,
} from "./graos";

describe("graosForGame", () => {
  it("quiz-basic vale 1x acertos", () => {
    expect(graosForGame("quiz-basic", 7, false)).toBe(7);
  });
  it("quiz-intermediate vale 2x acertos", () => {
    expect(graosForGame("quiz-intermediate", 5, false)).toBe(10);
  });
  it("quiz-advanced vale 3x acertos", () => {
    expect(graosForGame("quiz-advanced", 4, false)).toBe(12);
  });
  it("ordem-v60 vale 2x se firstTry", () => {
    expect(graosForGame("ordem-v60", 6, true)).toBe(12);
  });
  it("ordem-v60 vale 1x se nao firstTry", () => {
    expect(graosForGame("ordem-v60", 6, false)).toBe(6);
  });
});

describe("applyDailyCap", () => {
  it("nao limita quando abaixo do teto", () => {
    expect(applyDailyCap(30, 10)).toBe(30);
  });
  it("trunca o que passa do teto", () => {
    expect(applyDailyCap(50, GRAOS_DAILY_CAP - 20)).toBe(20);
  });
  it("retorna 0 quando teto ja atingido", () => {
    expect(applyDailyCap(40, GRAOS_DAILY_CAP)).toBe(0);
  });
});

describe("levelForGraos", () => {
  it("0 Graos = semente, next 100", () => {
    expect(levelForGraos(0)).toEqual({ key: "semente", min: 0, next: 100 });
  });
  it("99 ainda e semente", () => {
    expect(levelForGraos(99).key).toBe("semente");
  });
  it("100 vira broto", () => {
    expect(levelForGraos(100).key).toBe("broto");
  });
  it("1500+ e mestre com next null", () => {
    expect(levelForGraos(2000)).toEqual({ key: "mestre", min: 1500, next: null });
  });
});

describe("nextStreak", () => {
  it("primeira partida (sem data) = 1", () => {
    expect(nextStreak(null, "2026-08-28", 0)).toBe(1);
  });
  it("mesma data nao incrementa", () => {
    expect(nextStreak("2026-08-28", "2026-08-28", 3)).toBe(3);
  });
  it("dia seguinte incrementa", () => {
    expect(nextStreak("2026-08-27", "2026-08-28", 3)).toBe(4);
  });
  it("gap de 2+ dias reseta para 1", () => {
    expect(nextStreak("2026-08-25", "2026-08-28", 9)).toBe(1);
  });
});

describe("computeBadges", () => {
  const base = { gameKey: "quiz-basic" as const, correct: 3, total: 10, firstTry: false, streak: 1, isFirstGame: false };
  it("first-game na primeira partida", () => {
    expect(computeBadges([], { ...base, isFirstGame: true })).toContain("first-game");
  });
  it("quiz-perfect quando acerta tudo num quiz", () => {
    expect(computeBadges([], { ...base, correct: 10, total: 10 })).toContain("quiz-perfect");
  });
  it("ordem-v60-clean quando ordena V60 de primeira", () => {
    expect(computeBadges([], { ...base, gameKey: "ordem-v60", firstTry: true })).toContain("ordem-v60-clean");
  });
  it("streak-7 quando streak chega a 7", () => {
    expect(computeBadges([], { ...base, streak: 7 })).toContain("streak-7");
  });
  it("preserva badges existentes e nao duplica", () => {
    const out = computeBadges(["first-game"], { ...base, isFirstGame: true });
    expect(out.filter((b) => b === "first-game")).toHaveLength(1);
  });
});
