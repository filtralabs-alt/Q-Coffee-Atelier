# Play Section — Fase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a seção `/quiz` num hub `/play` com o quiz atual + um jogo novo ("Ordene o preparo", V60) + uma camada de progresso "Grãos" (XP temático) para usuários logados.

**Architecture:** Regras de pontuação puras vivem em `shared/play/` (importáveis por client e server via `@shared`, o mesmo padrão já usado no repo). O servidor recalcula os Grãos de cada partida (nunca confia no cliente), aplica um teto diário, atualiza streak e badges, e persiste em duas tabelas novas (`play_progress`, `play_sessions`). O front tem uma página-índice `/play`, o quiz movido para `/play/quiz` sem mudança de lógica, e o jogo novo em `/play/ordem`. Um hook client (`useSubmitPlaySession`) centraliza o POST + toast + celebração de nível/badge.

**Tech Stack:** React 18 + TypeScript + Wouter + TanStack Query v5 + shadcn/ui + Tailwind + Framer Motion (front); Express 5 + Drizzle ORM + PostgreSQL (back). Vitest (novo — não existe test runner hoje). `lucide-react` para ícones.

## Global Constraints

- **Bilíngue FR + PT-BR obrigatório.** Toda string visível passa por `t(key)` de `client/src/lib/i18n.tsx`. Nenhuma chave `play.*` ou `nav.play` pode faltar em `fr` **ou** `pt`. Idiomas: `type Lang = "fr" | "pt"`.
- **Sem dependência nova no front além de Vitest (devDependency).** Nada de `dnd-kit`. Drag = tap-to-reorder.
- **Banco só aditivo.** Apenas `CREATE TABLE` / novas colunas. Nunca `DROP`/`ALTER` destrutivo. `quiz_results` permanece intacta.
- **Grãos calculados no servidor.** O endpoint recebe `{ gameKey, correct, total, firstTry }` e recalcula; ignora qualquer valor de Grãos vindo do cliente.
- **Teto diário de Grãos = 150** (`GRAOS_DAILY_CAP`).
- **Faixas de nível (Grãos acumulados):** `0` semente · `100` broto · `300` barista · `700` barista-senior · `1500` mestre. Constante `GRAOS_LEVELS`.
- **Badges Fase 1:** `first-game`, `quiz-perfect`, `ordem-v60-clean`, `streak-7`.
- **`gameKey` válidos Fase 1:** `quiz-basic`, `quiz-intermediate`, `quiz-advanced`, `ordem-v60`.
- **Redirects preservam e-mails já enviados:** `/quiz` → `/play/quiz`.
- **Deploy é auto no push para `main`.** Todo o trabalho fica no branch `feat/play-section-fase-1`. Merge só após validação manual.
- **Rotas do app são registradas em DOIS lugares** em `client/src/App.tsx`: `AuthenticatedLayout` e `PublicLayout`. Manter paridade.
- **`git commit`** neste repo é lento (working tree grande). Usar `git commit --no-verify`. Sem hooks configurados, é seguro.
- **Desvio consciente do spec:** o spec cita `client/src/lib/play/graos.ts` como "compartilhado client/server". O plano coloca as regras puras em `shared/play/graos.ts` — importar de `client/src` no servidor quebraria a fronteira de build; `@shared` já é o canal correto e existente.

---

## File Structure

**Criar:**
- `vitest.config.ts` — config do test runner (aliases `@`, `@shared`; env node)
- `shared/play/graos.ts` — regras puras: `GameKey`, `graosForGame`, `applyDailyCap`, `GRAOS_LEVELS`, `levelForGraos`, `nextStreak`, `computeBadges`, constantes
- `shared/play/graos.test.ts` — testes unitários das regras
- `server/play/graos.ts` — `PlayStore` (interface), `applyPlaySession` (orquestração: teto + streak + badges + persistência via store injetado)
- `server/play/graos.test.ts` — testes de `applyPlaySession` com store fake em memória
- `client/src/lib/play/games.ts` — catálogo de jogos para a UI (key, i18n keys, ícone lucide, rota)
- `client/src/lib/play/ordem-data.ts` — métodos e passos ordenados `{ fr, pt }` (V60 nesta fase)
- `client/src/lib/play/ordem-data.test.ts` — sanidade dos dados
- `client/src/hooks/use-submit-play-session.ts` — hook: POST `/api/play/session` + invalidate + toast "+X Grãos" + celebração
- `client/src/components/play/graos-bar.tsx` — faixa de progresso (nível, barra, total, badges)
- `client/src/components/play/graos-celebration.tsx` — card de "subiu de nível / novo badge" (Framer Motion)
- `client/src/pages/play/index.tsx` — hub
- `client/src/pages/play/quiz.tsx` — quiz movido de `client/src/pages/quiz.tsx`
- `client/src/pages/play/ordem.tsx` — jogo "Ordene o preparo"

**Modificar:**
- `package.json` — devDep `vitest`, script `"test": "vitest run"`
- `shared/schema.ts` — tabelas `playProgress`, `playSessions`, relations, insert schemas, types
- `server/storage.ts` — métodos `getPlayProgress`, `upsertPlayProgress`, `createPlaySession`, `getTodayGraosEarned`; entradas na interface `IStorage`
- `server/routes.ts` — `POST /api/play/session`, `GET /api/play/progress`
- `client/src/App.tsx` — imports, `PUBLIC_ROUTES`, rotas `/play`, `/play/quiz`, `/play/ordem`, redirect `/quiz`
- `client/src/hooks/use-nav-items.ts` — `/quiz`→`/play`, `nav.quiz`→`nav.play`, ícone `Gamepad2`
- `client/src/lib/i18n.tsx` — rename namespace `quiz.*`→`play.quiz.*`; novas chaves `nav.play`, `play.*`
- `client/src/pages/profile.tsx` — bloco de progresso Grãos
- **Deletar:** `client/src/pages/quiz.tsx` (movido)

---

## Task 1: Vitest + regras puras de Grãos (`shared/play/graos.ts`)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `shared/play/graos.ts`
- Test: `shared/play/graos.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `type GameKey = "quiz-basic" | "quiz-intermediate" | "quiz-advanced" | "ordem-v60"`
  - `graosForGame(gameKey: GameKey, correct: number, firstTry: boolean): number`
  - `applyDailyCap(earned: number, alreadyEarnedToday: number): number` — `GRAOS_DAILY_CAP = 150`
  - `GRAOS_LEVELS: readonly { key: string; min: number }[]`
  - `levelForGraos(total: number): { key: string; min: number; next: number | null }`
  - `nextStreak(lastPlayedDate: string | null, today: string, current: number): number` — datas em `YYYY-MM-DD`
  - `computeBadges(existing: string[], ctx: BadgeContext): string[]` onde
    `interface BadgeContext { gameKey: GameKey; correct: number; total: number; firstTry: boolean; streak: number; isFirstGame: boolean }`
  - `ALL_BADGES: readonly ["first-game","quiz-perfect","ordem-v60-clean","streak-7"]`

- [ ] **Step 1: Instalar Vitest**

Run: `npm install -D vitest`
Expected: `vitest` aparece em `devDependencies` do `package.json`. (Pode demorar — filesystem lento.)

- [ ] **Step 2: Adicionar script de teste**

Em `package.json`, dentro de `"scripts"`, adicionar após `"db:push"`:

```json
    "db:push": "drizzle-kit push",
    "test": "vitest run"
```

- [ ] **Step 3: Criar `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "shared"),
      "@": path.resolve(__dirname, "client/src"),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", "dist"],
  },
});
```

- [ ] **Step 4: Escrever os testes que falham (`shared/play/graos.test.ts`)**

```ts
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
```

- [ ] **Step 5: Rodar os testes e ver falhar**

Run: `npm test`
Expected: FAIL — `Cannot find module './graos'`.

- [ ] **Step 6: Implementar `shared/play/graos.ts`**

```ts
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
  let current = GRAOS_LEVELS[0];
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
```

- [ ] **Step 7: Rodar os testes e ver passar**

Run: `npm test`
Expected: PASS — todos os testes de `graos.test.ts` verdes.

- [ ] **Step 8: Type-check**

Run: `npm run check`
Expected: sem erros novos.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts shared/play/graos.ts shared/play/graos.test.ts
git commit --no-verify -m "feat(play): regras puras de Graos + setup Vitest"
```

---

## Task 2: Catálogo de jogos + dados do "Ordene o preparo"

**Files:**
- Create: `client/src/lib/play/games.ts`
- Create: `client/src/lib/play/ordem-data.ts`
- Test: `client/src/lib/play/ordem-data.test.ts`

**Interfaces:**
- Consumes: `GameKey` de `@shared/play/graos`.
- Produces:
  - `interface PlayGame { key: GameKey | "quiz"; route: string; titleKey: string; descKey: string; icon: LucideIcon }`
  - `PLAY_GAMES: PlayGame[]` — dois itens: quiz (`route: "/play/quiz"`) e ordem (`route: "/play/ordem"`)
  - `interface OrdemMethod { key: "v60"; nameKey: string; steps: { fr: string; pt: string }[] }`
  - `ORDEM_METHODS: OrdemMethod[]` — só `v60` nesta fase
  - `getOrdemMethod(key: string): OrdemMethod | undefined`

- [ ] **Step 1: Escrever o teste que falha (`client/src/lib/play/ordem-data.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import { ORDEM_METHODS, getOrdemMethod } from "./ordem-data";

describe("ordem-data", () => {
  it("tem o metodo v60 com pelo menos 5 passos", () => {
    const v60 = getOrdemMethod("v60");
    expect(v60).toBeDefined();
    expect(v60!.steps.length).toBeGreaterThanOrEqual(5);
  });
  it("todo passo tem fr e pt nao vazios", () => {
    for (const method of ORDEM_METHODS) {
      for (const step of method.steps) {
        expect(step.fr.trim().length).toBeGreaterThan(0);
        expect(step.pt.trim().length).toBeGreaterThan(0);
      }
    }
  });
  it("getOrdemMethod retorna undefined para chave desconhecida", () => {
    expect(getOrdemMethod("chemex")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- ordem-data`
Expected: FAIL — módulo não existe.

- [ ] **Step 3: Implementar `client/src/lib/play/ordem-data.ts`**

```ts
export interface OrdemStep {
  fr: string;
  pt: string;
}

export interface OrdemMethod {
  key: "v60";
  nameKey: string;
  steps: OrdemStep[]; // ordem CORRETA
}

export const ORDEM_METHODS: OrdemMethod[] = [
  {
    key: "v60",
    nameKey: "play.ordem.method.v60",
    steps: [
      {
        fr: "Rincer le filtre à l'eau chaude et jeter cette eau",
        pt: "Enxaguar o filtro com água quente e descartar essa água",
      },
      {
        fr: "Ajouter le café moulu et niveler l'assiette de café",
        pt: "Adicionar o café moído e nivelar a cama de café",
      },
      {
        fr: "Verser 2x le poids du café pour la pré-infusion (bloom), attendre 30–45 s",
        pt: "Despejar 2x o peso do café para a pré-infusão (bloom), esperar 30–45 s",
      },
      {
        fr: "Première versée en spirale du centre vers l'extérieur",
        pt: "Primeira adição em espiral, do centro para fora",
      },
      {
        fr: "Deuxième versée jusqu'à atteindre le poids d'eau final (ratio ~1:16)",
        pt: "Segunda adição até atingir o peso final de água (ratio ~1:16)",
      },
      {
        fr: "Laisser l'eau finir de s'écouler (drawdown), viser ~2:30–3:00 au total",
        pt: "Deixar a água terminar de escoar (drawdown), mirar ~2:30–3:00 no total",
      },
    ],
  },
];

export function getOrdemMethod(key: string): OrdemMethod | undefined {
  return ORDEM_METHODS.find((m) => m.key === key);
}
```

- [ ] **Step 4: Implementar `client/src/lib/play/games.ts`**

```ts
import { HelpCircle, ListOrdered, type LucideIcon } from "lucide-react";

export interface PlayGame {
  key: string;
  route: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
}

export const PLAY_GAMES: PlayGame[] = [
  {
    key: "quiz",
    route: "/play/quiz",
    titleKey: "play.quiz.title",
    descKey: "play.quiz.subtitle",
    icon: HelpCircle,
  },
  {
    key: "ordem",
    route: "/play/ordem",
    titleKey: "play.ordem.title",
    descKey: "play.ordem.cardDesc",
    icon: ListOrdered,
  },
];
```

- [ ] **Step 5: Rodar os testes e ver passar**

Run: `npm test -- ordem-data`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add client/src/lib/play/games.ts client/src/lib/play/ordem-data.ts client/src/lib/play/ordem-data.test.ts
git commit --no-verify -m "feat(play): catalogo de jogos + dados do Ordene o preparo (V60)"
```

---

## Task 3: Schema — tabelas `play_progress` e `play_sessions`

**Files:**
- Modify: `shared/schema.ts`

**Interfaces:**
- Consumes: `users` de `./models/auth` (já importado no arquivo).
- Produces:
  - `playProgress` table + `PlayProgress` (`$inferSelect`) + `InsertPlayProgress`
  - `playSessions` table + `PlaySession` + `InsertPlaySession`
  - `insertPlayProgressSchema`, `insertPlaySessionSchema`
  - Colunas `playProgress`: `id`, `userId` (unique), `totalGraos` (int, default 0), `currentStreak` (int, default 0), `lastPlayedDate` (varchar, nullable — string `YYYY-MM-DD`), `badges` (jsonb `string[]`, default `[]`), `updatedAt`
  - Colunas `playSessions`: `id`, `userId`, `gameKey` (varchar), `graosEarned` (int), `correct` (int), `total` (int), `playedAt` (timestamp default now)

> Nota: `lastPlayedDate` como `varchar` (não `date`) para bater direto com as strings `YYYY-MM-DD` usadas em `nextStreak` sem conversão de fuso.

- [ ] **Step 1: Adicionar as tabelas em `shared/schema.ts`**

Logo após o bloco `quizResults` (por volta da linha 82), inserir:

```ts
export const playProgress = pgTable("play_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  totalGraos: integer("total_graos").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  lastPlayedDate: varchar("last_played_date"),
  badges: jsonb("badges").notNull().default(sql`'[]'::jsonb`).$type<string[]>(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlayProgressSchema = createInsertSchema(playProgress).omit({ id: true, updatedAt: true });
export type InsertPlayProgress = z.infer<typeof insertPlayProgressSchema>;
export type PlayProgress = typeof playProgress.$inferSelect;

export const playSessions = pgTable("play_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  gameKey: varchar("game_key").notNull(),
  graosEarned: integer("graos_earned").notNull(),
  correct: integer("correct").notNull(),
  total: integer("total").notNull(),
  playedAt: timestamp("played_at").defaultNow(),
});

export const insertPlaySessionSchema = createInsertSchema(playSessions).omit({ id: true, playedAt: true });
export type InsertPlaySession = z.infer<typeof insertPlaySessionSchema>;
export type PlaySession = typeof playSessions.$inferSelect;
```

- [ ] **Step 2: Adicionar relations**

Logo após `quizResultsRelations` (fim do arquivo), inserir:

```ts
export const playProgressRelations = relations(playProgress, ({ one }) => ({
  user: one(users, { fields: [playProgress.userId], references: [users.id] }),
}));

export const playSessionsRelations = relations(playSessions, ({ one }) => ({
  user: one(users, { fields: [playSessions.userId], references: [users.id] }),
}));
```

E no `usersRelations` existente, adicionar as duas linhas:

```ts
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
  tastingEntries: many(tastingEntries),
  quizResults: many(quizResults),
  playProgress: one(playProgress, { fields: [users.id], references: [playProgress.userId] }),
  playSessions: many(playSessions),
}));
```

- [ ] **Step 3: Type-check**

Run: `npm run check`
Expected: sem erros.

- [ ] **Step 4: Aplicar a migration no banco de dev**

Run: `npm run db:push`
Expected: Drizzle mostra `CREATE TABLE play_progress` e `CREATE TABLE play_sessions`, nenhum `DROP`. Confirmar.

> Se o prompt do drizzle sugerir qualquer `drop`/`truncate`, **abortar** e revisar — deveria ser puramente aditivo.

- [ ] **Step 5: Commit**

```bash
git add shared/schema.ts
git commit --no-verify -m "feat(play): schema play_progress + play_sessions"
```

---

## Task 4: Storage — métodos de acesso a dados

**Files:**
- Modify: `server/storage.ts`

**Interfaces:**
- Consumes: `playProgress`, `playSessions`, `PlayProgress`, `PlaySession`, `InsertPlaySession` de `@shared/schema`.
- Produces (na classe de storage e na interface `IStorage`):
  - `getPlayProgress(userId: string): Promise<PlayProgress | undefined>`
  - `upsertPlayProgress(userId: string, data: { totalGraos: number; currentStreak: number; lastPlayedDate: string; badges: string[] }): Promise<PlayProgress>`
  - `createPlaySession(data: InsertPlaySession): Promise<PlaySession>`
  - `getTodayGraosEarned(userId: string, date: string): Promise<number>` — soma `graosEarned` das sessões cujo `playedAt` cai no dia `date` (`YYYY-MM-DD`, fuso do servidor)

- [ ] **Step 1: Atualizar os imports do topo de `server/storage.ts`**

No bloco `import { ... } from "@shared/schema"`, adicionar:

```ts
  playProgress, type PlayProgress, type InsertPlayProgress,
  playSessions, type PlaySession, type InsertPlaySession,
```

E em `import { eq, desc, sql, count } from "drizzle-orm";` adicionar `and, gte, lt`:

```ts
import { eq, desc, sql, count, and, gte, lt } from "drizzle-orm";
```

- [ ] **Step 2: Adicionar as assinaturas na interface `IStorage`**

Perto das assinaturas de quiz (`createQuizResult`), adicionar:

```ts
  getPlayProgress(userId: string): Promise<PlayProgress | undefined>;
  upsertPlayProgress(userId: string, data: { totalGraos: number; currentStreak: number; lastPlayedDate: string; badges: string[] }): Promise<PlayProgress>;
  createPlaySession(data: InsertPlaySession): Promise<PlaySession>;
  getTodayGraosEarned(userId: string, date: string): Promise<number>;
```

- [ ] **Step 3: Implementar os métodos na classe de storage**

Logo após `createQuizResult`:

```ts
  async getPlayProgress(userId: string): Promise<PlayProgress | undefined> {
    const [row] = await db.select().from(playProgress).where(eq(playProgress.userId, userId));
    return row;
  }

  async upsertPlayProgress(
    userId: string,
    data: { totalGraos: number; currentStreak: number; lastPlayedDate: string; badges: string[] },
  ): Promise<PlayProgress> {
    const [row] = await db
      .insert(playProgress)
      .values({ userId, ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: playProgress.userId,
        set: { ...data, updatedAt: new Date() },
      })
      .returning();
    return row;
  }

  async createPlaySession(data: InsertPlaySession): Promise<PlaySession> {
    const [row] = await db.insert(playSessions).values(data).returning();
    return row;
  }

  async getTodayGraosEarned(userId: string, date: string): Promise<number> {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const [row] = await db
      .select({ value: sql<number>`coalesce(sum(${playSessions.graosEarned}), 0)` })
      .from(playSessions)
      .where(
        and(
          eq(playSessions.userId, userId),
          gte(playSessions.playedAt, start),
          lt(playSessions.playedAt, end),
        ),
      );
    return Number(row?.value ?? 0);
  }
```

- [ ] **Step 4: Type-check**

Run: `npm run check`
Expected: sem erros — a classe satisfaz `IStorage`.

- [ ] **Step 5: Commit**

```bash
git add server/storage.ts
git commit --no-verify -m "feat(play): metodos de storage para progresso e sessoes"
```

---

## Task 5: Serviço `applyPlaySession` + endpoints da API

**Files:**
- Create: `server/play/graos.ts`
- Test: `server/play/graos.test.ts`
- Modify: `server/routes.ts`

**Interfaces:**
- Consumes: `graosForGame`, `applyDailyCap`, `levelForGraos`, `nextStreak`, `computeBadges`, `GameKey`, `GAME_KEYS` de `@shared/play/graos`; `storage` de `./storage` (no route); `isAuthenticated` de `./auth`.
- Produces:
  - `interface PlayStore { getPlayProgress(userId): Promise<{ totalGraos: number; currentStreak: number; lastPlayedDate: string | null; badges: string[] } | undefined>; upsertPlayProgress(userId, data): Promise<any>; createPlaySession(data): Promise<any>; getTodayGraosEarned(userId, date): Promise<number>; }`
  - `interface PlaySessionInput { gameKey: GameKey; correct: number; total: number; firstTry: boolean }`
  - `interface PlaySessionResult { totalGraos: number; level: { key: string; min: number; next: number | null }; currentStreak: number; badges: string[]; graosEarned: number; leveledUp: boolean; newBadges: string[] }`
  - `applyPlaySession(store: PlayStore, userId: string, input: PlaySessionInput, today?: string): Promise<PlaySessionResult>`
  - `todayISO(): string` — data local do servidor em `YYYY-MM-DD`
  - Endpoint `POST /api/play/session` → body `{ gameKey, correct, total, firstTry? }` → `PlaySessionResult`
  - Endpoint `GET /api/play/progress` → `{ totalGraos, level, currentStreak, badges }` (zeros se nunca jogou)

- [ ] **Step 1: Escrever os testes que falham (`server/play/graos.test.ts`)**

```ts
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- server/play`
Expected: FAIL — módulo não existe.

- [ ] **Step 3: Implementar `server/play/graos.ts`**

```ts
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
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- server/play`
Expected: PASS.

- [ ] **Step 5: Adicionar os endpoints em `server/routes.ts`**

Logo após o bloco `app.get("/api/quiz-results", ...)`:

```ts
  app.post("/api/play/session", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { applyPlaySession } = await import("./play/graos");
      const { gameKey, correct, total, firstTry } = req.body ?? {};
      if (typeof gameKey !== "string" || typeof correct !== "number" || typeof total !== "number") {
        return res.status(400).json({ message: "Invalid data" });
      }
      const result = await applyPlaySession(storage, userId, {
        gameKey,
        correct,
        total,
        firstTry: Boolean(firstTry),
      });
      res.json(result);
    } catch (error) {
      console.error("Error saving play session:", error);
      res.status(500).json({ message: "Failed to save play session" });
    }
  });

  app.get("/api/play/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { levelForGraos } = await import("@shared/play/graos");
      const progress = await storage.getPlayProgress(userId);
      const totalGraos = progress?.totalGraos ?? 0;
      res.json({
        totalGraos,
        level: levelForGraos(totalGraos),
        currentStreak: progress?.currentStreak ?? 0,
        badges: progress?.badges ?? [],
      });
    } catch (error) {
      console.error("Error fetching play progress:", error);
      res.status(500).json({ message: "Failed to fetch play progress" });
    }
  });
```

> `import(...)` dinâmico evita mexer no bloco de imports do topo se ele for grande; se o arquivo já importa de `@shared/schema` no topo, pode-se usar import estático — seguir o padrão local.

- [ ] **Step 6: Type-check + testes**

Run: `npm run check && npm test`
Expected: sem erros; todos os testes verdes.

- [ ] **Step 7: Commit**

```bash
git add server/play/graos.ts server/play/graos.test.ts server/routes.ts
git commit --no-verify -m "feat(play): applyPlaySession + endpoints /api/play"
```

---

## Task 6: Hook `useSubmitPlaySession` + componentes `GraosBar` e `GraosCelebration` + i18n base

**Files:**
- Create: `client/src/hooks/use-submit-play-session.ts`
- Create: `client/src/components/play/graos-bar.tsx`
- Create: `client/src/components/play/graos-celebration.tsx`
- Modify: `client/src/lib/i18n.tsx`

**Interfaces:**
- Consumes: `apiRequest`, `queryClient` de `@/lib/queryClient`; `useToast` de `@/hooks/use-toast`; `useAuth` de `@/hooks/use-auth`; `useI18n` de `@/lib/i18n`; `GameKey` de `@shared/play/graos`; `PlaySessionResult` de `@/../../server/play/graos`? **Não** — redeclarar o tipo no client (ver abaixo) para não cruzar a fronteira server.
- Produces:
  - `interface PlaySessionOutcome { totalGraos: number; level: { key: string; min: number; next: number | null }; currentStreak: number; badges: string[]; graosEarned: number; leveledUp: boolean; newBadges: string[] }`
  - `useSubmitPlaySession(): { submit(input: { gameKey: GameKey; correct: number; total: number; firstTry: boolean }): Promise<PlaySessionOutcome | null>; celebration: { leveledUp: boolean; levelKey: string; newBadges: string[] } | null; dismiss(): void }`
    - Se não há `user`, `submit` retorna `null` sem chamar a API.
  - `<GraosBar />` — busca `GET /api/play/progress` via `useQuery(["/api/play/progress"])`, renderiza nível + barra + total + até 3 badges. Sem props. Só renderiza conteúdo se `user`; senão renderiza o CTA `play.graos.loginCta`.
  - `<GraosCelebration outcome={{ leveledUp, levelKey, newBadges }} onDismiss={() => void} />`

- [ ] **Step 1: Adicionar as chaves i18n base**

Em `client/src/lib/i18n.tsx`, no objeto `translations`, adicionar (perto de `nav.quiz`):

```ts
  "nav.play": { fr: "Play", pt: "Play" },
```

E um bloco novo de Grãos:

```ts
  "play.title": { fr: "Play", pt: "Play" },
  "play.subtitle": { fr: "Jouez, apprenez, accumulez des Grains", pt: "Jogue, aprenda e acumule Grãos" },
  "play.graos.label": { fr: "Grains", pt: "Grãos" },
  "play.graos.unit": { fr: "Grains", pt: "Grãos" },
  "play.graos.toNext": { fr: "jusqu'au niveau suivant", pt: "até o próximo nível" },
  "play.graos.maxLevel": { fr: "Niveau maximum atteint", pt: "Nível máximo atingido" },
  "play.graos.streak": { fr: "jours d'affilée", pt: "dias seguidos" },
  "play.graos.earned": { fr: "+{n} Grains", pt: "+{n} Grãos" },
  "play.graos.capReached": { fr: "Limite quotidienne de Grains atteinte", pt: "Limite diário de Grãos atingido" },
  "play.graos.loginCta": { fr: "Connectez-vous pour accumuler des Grains et monter de niveau", pt: "Entre para acumular Grãos e subir de nível" },
  "play.graos.levelUp": { fr: "Niveau supérieur !", pt: "Subiu de nível!" },
  "play.graos.newBadge": { fr: "Nouveau badge !", pt: "Novo emblema!" },
  "play.level.semente": { fr: "Graine", pt: "Semente" },
  "play.level.broto": { fr: "Pousse", pt: "Broto" },
  "play.level.barista": { fr: "Barista", pt: "Barista" },
  "play.level.barista-senior": { fr: "Barista Senior", pt: "Barista Sênior" },
  "play.level.mestre": { fr: "Maître", pt: "Mestre" },
  "play.badge.first-game": { fr: "Première partie", pt: "Primeira partida" },
  "play.badge.quiz-perfect": { fr: "Quiz parfait", pt: "Quiz perfeito" },
  "play.badge.ordem-v60-clean": { fr: "V60 dans l'ordre", pt: "V60 na ordem" },
  "play.badge.streak-7": { fr: "7 jours d'affilée", pt: "7 dias seguidos" },
```

> `t()` não interpola — para `play.graos.earned` fazer `t("play.graos.earned").replace("{n}", String(n))` no hook.

- [ ] **Step 2: Implementar `client/src/hooks/use-submit-play-session.ts`**

```ts
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
```

- [ ] **Step 3: Implementar `client/src/components/play/graos-bar.tsx`**

```tsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sprout, Flame, LogIn } from "lucide-react";

interface ProgressResponse {
  totalGraos: number;
  level: { key: string; min: number; next: number | null };
  currentStreak: number;
  badges: string[];
}

export function GraosBar() {
  const { user } = useAuth();
  const { t } = useI18n();

  const { data } = useQuery<ProgressResponse>({
    queryKey: ["/api/play/progress"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <Card className="p-4 bg-primary/5 border-primary/20 flex items-center gap-2" data-testid="graos-bar-login">
        <LogIn className="h-4 w-4 text-primary flex-shrink-0" />
        <p className="text-xs text-muted-foreground">{t("play.graos.loginCta")}</p>
      </Card>
    );
  }

  if (!data) return null;

  const { totalGraos, level, currentStreak, badges } = data;
  const span = level.next !== null ? level.next - level.min : 0;
  const done = level.next !== null ? totalGraos - level.min : 1;
  const pct = level.next !== null && span > 0 ? Math.min(100, (done / span) * 100) : 100;

  return (
    <Card className="p-4 space-y-2" data-testid="graos-bar">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{t(`play.level.${level.key}`)}</span>
        </div>
        <div className="flex items-center gap-3">
          {currentStreak > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-amber-500" /> {currentStreak} {t("play.graos.streak")}
            </span>
          )}
          <span className="text-sm font-bold text-primary" data-testid="graos-total">
            {totalGraos} {t("play.graos.unit")}
          </span>
        </div>
      </div>
      <Progress value={pct} className="h-1.5" />
      <p className="text-[10px] text-muted-foreground">
        {level.next !== null
          ? `${level.next - totalGraos} ${t("play.graos.unit")} ${t("play.graos.toNext")}`
          : t("play.graos.maxLevel")}
      </p>
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {badges.slice(-3).map((b) => (
            <Badge key={b} variant="secondary" className="text-[10px]">
              {t(`play.badge.${b}`)}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
```

- [ ] **Step 4: Implementar `client/src/components/play/graos-celebration.tsx`**

```tsx
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
```

- [ ] **Step 5: Type-check**

Run: `npm run check`
Expected: sem erros. (Confirmar que `framer-motion` resolve — está em `package.json`.)

- [ ] **Step 6: Commit**

```bash
git add client/src/hooks/use-submit-play-session.ts client/src/components/play/ client/src/lib/i18n.tsx
git commit --no-verify -m "feat(play): hook de sessao + GraosBar + celebracao + i18n base"
```

---

## Task 7: Roteamento e navegação — `/play` + redirect `/quiz`

**Files:**
- Modify: `client/src/App.tsx`
- Modify: `client/src/hooks/use-nav-items.ts`

**Interfaces:**
- Consumes: nada novo além do que já existe.
- Produces: rotas `/play`, `/play/quiz`, `/play/ordem` nos dois layouts; `/quiz` redireciona para `/play/quiz`; nav aponta para `/play`.

> As páginas `PlayIndex`, `PlayQuiz` (movida na Task 8), `PlayOrdem` (Task 10) ainda não existem quando esta task roda. Para não quebrar o build, esta task cria **stubs mínimos** desses três arquivos e a Task 8/10 os preenche. Stub = componente que retorna um `<div>` vazio.

- [ ] **Step 1: Criar os stubs das páginas**

`client/src/pages/play/index.tsx`:
```tsx
export default function PlayIndex() {
  return <div data-testid="play-index" />;
}
```

`client/src/pages/play/quiz.tsx`:
```tsx
export default function PlayQuiz() {
  return <div data-testid="play-quiz" />;
}
```

`client/src/pages/play/ordem.tsx`:
```tsx
export default function PlayOrdem() {
  return <div data-testid="play-ordem" />;
}
```

- [ ] **Step 2: Atualizar imports e `PUBLIC_ROUTES` em `client/src/App.tsx`**

Trocar o import do quiz:
```ts
// remover: import QuizPage from "@/pages/quiz";
import PlayIndex from "@/pages/play/index";
import PlayQuiz from "@/pages/play/quiz";
import PlayOrdem from "@/pages/play/ordem";
import { Redirect } from "wouter";
```

Em `PUBLIC_ROUTES`, trocar `"/quiz"` por:
```ts
  "/play",
  "/play/quiz",
  "/play/ordem",
```

- [ ] **Step 3: Atualizar as rotas nos dois layouts**

Em `AuthenticatedLayout` e `PublicLayout`, trocar
```tsx
<Route path="/quiz" component={QuizPage} />
```
por
```tsx
<Route path="/play" component={PlayIndex} />
<Route path="/play/quiz" component={PlayQuiz} />
<Route path="/play/ordem" component={PlayOrdem} />
<Route path="/quiz"><Redirect to="/play/quiz" /></Route>
```

- [ ] **Step 4: Atualizar `client/src/hooks/use-nav-items.ts`**

```ts
import { Coffee, BookOpen, Map, Gamepad2, BarChart3, Calendar, LogIn } from "lucide-react";
```
(trocar `HelpCircle` por `Gamepad2` no import)

Nos dois arrays, trocar o item do quiz por:
```ts
        { href: "/play", icon: Gamepad2, label: t("nav.play") },
```

- [ ] **Step 5: Rodar o app e verificar**

Run: `npm run dev`
Verificar manualmente:
- `/play` renderiza (div vazio por ora), nav mostra "Play" com ícone de controle.
- `/quiz` redireciona para `/play/quiz`.
- Logado e deslogado (público), ambas as rotas acessíveis.

Run: `npm run check`
Expected: sem erros.

- [ ] **Step 6: Commit**

```bash
git add client/src/App.tsx client/src/hooks/use-nav-items.ts client/src/pages/play/
git commit --no-verify -m "feat(play): rotas /play + redirect /quiz + nav"
```

---

## Task 8: Mover o quiz para `/play/quiz` + rename i18n `quiz.*` → `play.quiz.*` + submit de sessão

**Files:**
- Modify: `client/src/pages/play/quiz.tsx` (substituir o stub pelo conteúdo de `client/src/pages/quiz.tsx`)
- Delete: `client/src/pages/quiz.tsx`
- Modify: `client/src/lib/i18n.tsx` (rename das 34 chaves `quiz.*` → `play.quiz.*`)

**Interfaces:**
- Consumes: `useSubmitPlaySession`, `GraosCelebration` da Task 6; `quizQuestions` de `@/lib/quiz-data` (inalterado).
- Produces: `/play/quiz` funcional; ao finalizar, chama `submit({ gameKey: "quiz-<level>", correct: score, total, firstTry: false })`.

> Mapeamento de nível → gameKey: `basic`→`quiz-basic`, `intermediate`→`quiz-intermediate`, `advanced`→`quiz-advanced`.

- [ ] **Step 1: Copiar o conteúdo do quiz para o novo arquivo**

Copiar `client/src/pages/quiz.tsx` inteiro para `client/src/pages/play/quiz.tsx` (sobrescrevendo o stub). Renomear o componente de `QuizPage` para `PlayQuiz` e manter `export default`.

- [ ] **Step 2: Renomear as chaves i18n**

Em `client/src/lib/i18n.tsx`, renomear as 34 chaves com prefixo `"quiz.` para `"play.quiz.`. Lista completa (nada fora dela):

```
quiz.title quiz.subtitle quiz.basic quiz.intermediate quiz.advanced quiz.questions
quiz.start quiz.question quiz.of quiz.correct quiz.incorrect quiz.next quiz.finish
quiz.score quiz.retry quiz.back quiz.badge.novice quiz.badge.amateur quiz.badge.expert
quiz.badge.master quiz.bonus.label quiz.bonus.title quiz.bonus.basic quiz.bonus.intermediate
quiz.bonus.advanced quiz.bonus.source quiz.bonus2.label quiz.bonus2.title quiz.bonus2.basic
quiz.bonus2.intermediate quiz.bonus2.advanced quiz.bonus2.source quiz.loginPrompt.title
quiz.loginPrompt.desc
```

- [ ] **Step 3: Atualizar as chamadas `t("quiz.…")` no novo arquivo**

Em `client/src/pages/play/quiz.tsx`, substituir todas as ocorrências de `t("quiz.` por `t("play.quiz.`.

- [ ] **Step 4: Verificar que nada mais usa `quiz.` como chave i18n**

Run: `grep -rn 't("quiz\.' client/src`
Expected: **nenhum resultado**.

Run: `grep -rn '"quiz\.' client/src/lib/i18n.tsx`
Expected: **nenhum resultado** (todas viraram `play.quiz.`).

- [ ] **Step 5: Ligar o submit de sessão + celebração**

Em `client/src/pages/play/quiz.tsx`:

Adicionar imports:
```ts
import { useSubmitPlaySession } from "@/hooks/use-submit-play-session";
import { GraosCelebration } from "@/components/play/graos-celebration";
```

No componente, adicionar:
```ts
const { submit, celebration, dismiss } = useSubmitPlaySession();
```

Na função `handleNext`, no ramo em que o quiz termina (onde já chama `saveResult.mutate`), adicionar logo depois:
```ts
const gameKey = `quiz-${selectedLevel}` as const;
submit({ gameKey, correct: finalScore, total: questions.length, firstTry: false });
```

Renderizar a celebração — adicionar antes do `return` final da tela de resultado (ou no wrapper externo):
```tsx
<GraosCelebration outcome={celebration} onDismiss={dismiss} />
```

- [ ] **Step 6: Deletar o arquivo antigo**

```bash
git rm client/src/pages/quiz.tsx
```

- [ ] **Step 7: Verificar**

Run: `npm run check`
Expected: sem erros (nenhuma referência pendente a `@/pages/quiz`).

Run: `npm run dev` — jogar um quiz logado até o fim: toast "+X Grãos" aparece, `GraosBar` (quando montada na Task 9) reflete; deslogado: sem toast, card de login como antes.

Run: `npm test`
Expected: tudo verde.

- [ ] **Step 8: Commit**

```bash
git add client/src/pages/play/quiz.tsx client/src/lib/i18n.tsx
git commit --no-verify -m "feat(play): move quiz para /play/quiz, rename i18n, submit de Graos"
```

---

## Task 9: Página-índice `/play`

**Files:**
- Modify: `client/src/pages/play/index.tsx` (substituir o stub)

**Interfaces:**
- Consumes: `PLAY_GAMES` de `@/lib/play/games`; `GraosBar` de `@/components/play/graos-bar`; `useI18n`.
- Produces: hub renderizado em `/play`.

- [ ] **Step 1: Implementar `client/src/pages/play/index.tsx`**

```tsx
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
```

- [ ] **Step 2: Adicionar a chave i18n `play.ordem.cardDesc`** (usada pelo catálogo; a `play.ordem.*` completa vem na Task 10, mas esta é referenciada aqui)

Em `client/src/lib/i18n.tsx`:
```ts
  "play.ordem.cardDesc": { fr: "Remettez les étapes de préparation dans le bon ordre", pt: "Coloque os passos do preparo na ordem certa" },
```

- [ ] **Step 3: Verificar**

Run: `npm run check`
Run: `npm run dev` — `/play` mostra a `GraosBar` (ou CTA de login) e dois cards; clicar leva a `/play/quiz` e `/play/ordem`.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/play/index.tsx client/src/lib/i18n.tsx
git commit --no-verify -m "feat(play): pagina-indice /play com GraosBar e catalogo"
```

---

## Task 10: Jogo "Ordene o preparo" (`/play/ordem`)

**Files:**
- Modify: `client/src/pages/play/ordem.tsx` (substituir o stub)
- Modify: `client/src/lib/i18n.tsx` (bloco `play.ordem.*`)

**Interfaces:**
- Consumes: `getOrdemMethod`, `ORDEM_METHODS` de `@/lib/play/ordem-data`; `useSubmitPlaySession`, `GraosCelebration`; `useI18n`.
- Produces: `/play/ordem` jogável. Ao concluir, `submit({ gameKey: "ordem-v60", correct: <passos certos na conferência final>, total: <n passos>, firstTry: <acertou tudo na 1ª conferência> })`.

- [ ] **Step 1: Adicionar as chaves i18n `play.ordem.*`**

```ts
  "play.ordem.title": { fr: "Remets dans l'ordre", pt: "Ordene o preparo" },
  "play.ordem.instruction": { fr: "Touchez deux étapes pour les échanger, puis vérifiez", pt: "Toque em dois passos para trocá-los de lugar e depois confira" },
  "play.ordem.check": { fr: "Vérifier", pt: "Conferir" },
  "play.ordem.retry": { fr: "Réessayer", pt: "Tentar de novo" },
  "play.ordem.done": { fr: "Parfait, dans le bon ordre !", pt: "Perfeito, na ordem certa!" },
  "play.ordem.someWrong": { fr: "Certaines étapes sont mal placées", pt: "Alguns passos estão fora do lugar" },
  "play.ordem.backToPlay": { fr: "Retour", pt: "Voltar" },
  "play.ordem.method.v60": { fr: "V60", pt: "V60" },
  "play.ordem.moveUp": { fr: "Monter", pt: "Subir" },
  "play.ordem.moveDown": { fr: "Descendre", pt: "Descer" },
```

- [ ] **Step 2: Implementar `client/src/pages/play/ordem.tsx`**

```tsx
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
```

- [ ] **Step 3: Verificar**

Run: `npm run check`
Run: `npm run dev` — em `/play/ordem`:
- Passos aparecem embaralhados; tap+tap troca; setas ↑↓ movem.
- "Conferir" marca certo/errado; ao acertar tudo, feedback verde + (logado) toast de Grãos; se acertou na 1ª → badge `ordem-v60-clean` (celebração).
- Botão "Conferir" some quando resolvido.

Run: `npm test`

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/play/ordem.tsx client/src/lib/i18n.tsx
git commit --no-verify -m "feat(play): jogo Ordene o preparo (V60)"
```

---

## Task 11: Bloco de progresso no `/profile`

**Files:**
- Modify: `client/src/pages/profile.tsx`
- Modify: `client/src/lib/i18n.tsx`

**Interfaces:**
- Consumes: `GET /api/play/progress` via `useQuery(["/api/play/progress"])`; `useI18n`; `useAuth`.
- Produces: card de Grãos/nível/streak abaixo do formulário de perfil.

- [ ] **Step 1: Adicionar chaves i18n**

```ts
  "profile.play.title": { fr: "Ma progression", pt: "Meu progresso" },
  "profile.play.empty": { fr: "Jouez pour accumuler des Grains", pt: "Jogue para acumular Grãos" },
```

- [ ] **Step 2: Adicionar o card em `client/src/pages/profile.tsx`**

Imports:
```ts
import { useQuery } from "@tanstack/react-query";
import { Sprout } from "lucide-react";
```

Dentro do componente, antes do `return`:
```ts
const { data: play } = useQuery<{ totalGraos: number; level: { key: string }; currentStreak: number; badges: string[] }>({
  queryKey: ["/api/play/progress"],
  enabled: !!user,
});
```

Depois do `</Card>` do formulário, dentro do `<div className="max-w-lg ...">`:
```tsx
<Card className="mt-4">
  <CardHeader>
    <CardTitle className="text-base font-semibold flex items-center gap-2">
      <Sprout className="h-4 w-4 text-primary" /> {t("profile.play.title")}
    </CardTitle>
  </CardHeader>
  <CardContent>
    {play && play.totalGraos > 0 ? (
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{t(`play.level.${play.level.key}`)}</span>
        <span className="text-primary font-bold">{play.totalGraos} {t("play.graos.unit")}</span>
        {play.currentStreak > 0 && (
          <span className="text-xs text-muted-foreground">
            {play.currentStreak} {t("play.graos.streak")}
          </span>
        )}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">{t("profile.play.empty")}</p>
    )}
  </CardContent>
</Card>
```

- [ ] **Step 3: Verificar**

Run: `npm run check`
Run: `npm run dev` — `/profile` mostra o card; sem jogos → mensagem vazia; após jogar → nível + Grãos + streak.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/profile.tsx client/src/lib/i18n.tsx
git commit --no-verify -m "feat(play): bloco de progresso no /profile"
```

---

## Task 12: Verificação final e i18n audit

**Files:** nenhum novo — checagem cruzada.

- [ ] **Step 1: Audit de i18n — nenhuma chave `play.*` faltando em FR ou PT**

Rodar este script pontual (pode ser um arquivo temporário `scripts/i18n-check.mjs` ou inline):

```bash
node --input-type=module -e '
import fs from "node:fs";
const src = fs.readFileSync("client/src/lib/i18n.tsx","utf8");
const re = /"([a-zA-Z0-9_.-]+)":\s*\{\s*fr:\s*("(?:[^"\\]|\\.)*")\s*,\s*pt:\s*("(?:[^"\\]|\\.)*")\s*\}/g;
let m, bad=[];
const keys=new Set();
while((m=re.exec(src))){ keys.add(m[1]); if(m[2].length<3||m[3].length<3) bad.push(m[1]); }
const used=[...fs.readFileSync("/dev/stdin","utf8").matchAll(/t\("([a-zA-Z0-9_.-]+)"\)/g)].map(x=>x[1]);
console.log("play.* keys:", [...keys].filter(k=>k.startsWith("play.")||k==="nav.play").length);
console.log("empty values:", bad);
' < <(grep -rhoE 't\("[a-zA-Z0-9_.-]+"\)' client/src)
```

Expected: `empty values: []`. Toda chave `t("play....")` referenciada no código existe no objeto.

Alternativa simples e suficiente: `grep -roE 't\("play\.[a-zA-Z0-9_.-]+"\)' client/src | sort -u` e conferir à mão que cada uma existe em `i18n.tsx` com `fr` e `pt` não vazios.

- [ ] **Step 2: Sem referências órfãs a `quiz.*` ou `@/pages/quiz`**

```bash
grep -rn '@/pages/quiz' client/src ; grep -rn 't("quiz\.' client/src ; grep -rn '"quiz\.' client/src/lib/i18n.tsx
```
Expected: os três sem resultado.

- [ ] **Step 3: Build completo + testes + type-check**

```bash
npm run check && npm test && npm run build
```
Expected: tudo passa.

- [ ] **Step 4: Smoke manual (`npm run dev`)**

- Deslogado: `/play`, `/play/quiz`, `/play/ordem` acessíveis; `GraosBar` mostra CTA de login; quiz e ordem jogáveis sem persistência; `/quiz` → `/play/quiz`.
- Logado: joga quiz → toast "+Grãos"; `GraosBar` e `/profile` atualizam; joga ordem de primeira → celebração de badge; teto diário: jogar repetidamente até bater 150 e ver `play.graos.capReached`.
- Nav mobile e desktop: "Play" com ícone `Gamepad2`.
- FR e PT: alternar idioma e conferir todas as telas de Play.

- [ ] **Step 5: Commit final (se houver ajuste) e parar para revisão antes do merge**

```bash
git add -A && git commit --no-verify -m "chore(play): audit i18n + verificacao final Fase 1"
```

**NÃO fazer merge em `main` automaticamente.** Fase 1 termina com o branch `feat/play-section-fase-1` pronto para revisão manual e teste em preview. O merge (= deploy) é decisão do usuário.

---

## Self-Review

**1. Spec coverage**

| Requisito do spec | Task |
|---|---|
| `/play` índice + sub-rotas + redirect `/quiz` | 7 |
| `PUBLIC_ROUTES`, nav (ícone `Gamepad2`, `nav.play`), paridade nos 2 layouts | 7 |
| Estrutura `pages/play/`, `lib/play/`, `server/play/` | 2, 5, 7, 8, 9, 10 |
| Quiz movido sem mudar lógica | 8 |
| "Ordene o preparo" tap-to-reorder, V60, sem dep nova, Framer Motion | 10 |
| Chemex depois só adicionando dados | 2 (estrutura `ORDEM_METHODS` aberta) |
| `play_progress` + `play_sessions` (aditivo) | 3 |
| API `POST /api/play/session` (recalcula server-side) + `GET /api/play/progress` | 5 |
| Quiz também chama `/api/play/session` | 8 |
| Regras puras isoladas + testadas | 1 (`shared/play/graos.ts`), 5 (`applyPlaySession`) |
| Grãos/partida com pesos; níveis; badges; streak; teto 150 | 1 |
| `GraosBar` no topo do `/play`; CTA login p/ visitante | 6, 9 |
| Resumo no `/profile` | 11 |
| Toast "+X Grãos" + card de celebração; card de login deslogado preservado | 6, 8, 10 |
| i18n rename `quiz.*`→`play.quiz.*` + novas chaves, FR+PT | 8, 6, 9, 10, 11 |
| Testes Vitest (regras, teto, streak, badges, applyPlaySession) | 1, 5 |
| Migration testada, só `CREATE TABLE` | 3 |
| Trabalho em branch, sem merge automático | 7–12 |

Nota de desvio: regras puras em `shared/play/` e não `client/src/lib/play/` (justificado no header). Testes de servidor via store injetado em vez de DB real (mais rápidos, sem infra de test-DB que não existe) — cobrem a lógica que o spec pede.

**2. Placeholder scan:** sem "TBD"/"TODO"/"add error handling" genéricos. Cada step de código traz o código. As páginas stub na Task 7 são intencionais e preenchidas nas Tasks 8–10 (declarado).

**3. Type consistency:** `PlaySessionResult` (server) e `PlaySessionOutcome` (client) têm os mesmos campos, deliberadamente redeclarados para não cruzar a fronteira server→client. `GameKey` vem de `@shared/play/graos` em ambos. `applyPlaySession(store, userId, input, today?)` — assinatura idêntica no teste (Task 5 Step 1) e na implementação (Step 3). `getTodayGraosEarned(userId, date)` idêntico em `IStorage` (Task 4), `PlayStore` (Task 5) e no fake de teste. `levelForGraos` retorna `{ key, min, next }` — consumido assim na `GraosBar`, no endpoint e nos testes.
