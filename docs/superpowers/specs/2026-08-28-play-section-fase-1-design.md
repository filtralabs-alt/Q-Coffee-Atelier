# Play Section — Fase 1 (Design)

**Data:** 2026-08-28
**App:** O Baristech (`projetos/baristech`)
**Status:** aprovado — pronto para plano de implementação

---

## Contexto

Hoje o app tem uma seção **Quiz** (`/quiz`) com um único jogo: quiz de conhecimento
em 3 níveis (básico / intermediário / avançado), bilíngue FR/PT-BR, definido em
`client/src/lib/quiz-data.ts` e renderizado por `client/src/pages/quiz.tsx`
(255 linhas, monolítico). Resultados salvos na tabela `quiz_results` via
`POST /api/quiz-results` (só para logados; visitante joga sem persistência).

Queremos transformar isso numa seção **Play**: um hub de jogos lúdicos que ajudam
a memorizar o preparo de café e a reforçar a experiência do atelier, com uma
camada de progresso ("Grãos") que incentiva o retorno.

### Escopo desta fase

1. Rename `/quiz` → seção **Play** com página-índice + redirects.
2. Quiz atual movido para dentro do Play, **sem mudança de lógica**.
3. Jogo novo **"Ordene o preparo"** — tap-to-reorder, apenas V60 nesta fase
   (Chemex depois, só adicionando dados).
4. Camada **Grãos** (XP temático): pontuação acumulada, níveis, badges, streak.
   Apenas para usuários logados. Faixa no topo de `/play` + resumo em `/profile`.

### Fora de escopo (fases futuras — documentado, não construído)

- **Fase 2 — Torneio assíncrono:** desafio semanal/mensal, leaderboard público
  (opt-in, só nome). Reaproveita `play_sessions`. Nenhuma tecnologia nova.
- **Fase 3 — Grãos como recompensa:** resgate de Grãos por desconto em lojas
  parceiras. Requer painel de parceiros, emissão/validação de cupons, antifraude
  reforçado, conciliação e termos jurídicos. Só faz sentido com parceiros já
  fechados. O **teto diário de ganho** já entra na Fase 1 por ser barato agora e
  essencial depois.
- Jogo da memória, "Receita cronometrada", roda de sabores — backlog.

### Segurança entre plataformas

A Fase 1 toca **apenas** o repositório `baristech`. A **Q Coffee TV** é outro
repo, outro deploy, outro banco — não é importada nem referenciada. Fica intacta.
Decisão consciente de **não** extrair o `ChampionshipModule` da Q Coffee TV como
pacote compartilhado: as bases têm i18n e brand tokens próprios e o módulo está
acoplado ao renderer de digital signage; manter desacoplado é o que torna cada
mudança segura.

Dentro do `baristech` a mudança é aditiva no banco (só `CREATE TABLE`, sem
`DROP`/`ALTER` destrutivo); `quiz_results` permanece intacta; redirect preserva
links de e-mail marketing já enviados.

---

## Seção 1 — Roteamento e navegação

- Nova página-índice `client/src/pages/play/index.tsx` na rota **`/play`**:
  faixa de progresso no topo (Grãos + nível + badges recentes) + grid de cards
  dos jogos disponíveis ("Quiz de conhecimento", "Ordene o preparo").
- Jogos em sub-rotas: **`/play/quiz`** e **`/play/ordem`**.
- Redirects com `<Redirect>` do Wouter: `/quiz` → `/play/quiz`.
- `PUBLIC_ROUTES` em `client/src/App.tsx`: remover `/quiz`, adicionar `/play`,
  `/play/quiz`, `/play/ordem`. Manter `/quiz` roteável só para o redirect.
- `client/src/hooks/use-nav-items.ts` (nos dois modos, público e logado):
  `href` `/quiz` → `/play`; `label` `nav.quiz` → `nav.play`;
  ícone `HelpCircle` → `Gamepad2`.
- Rotas registradas em `App.tsx` tanto no layout autenticado quanto no público
  (hoje o quiz aparece nos dois — manter paridade).

---

## Seção 2 — Estrutura de arquivos

```
client/src/pages/play/
├── index.tsx            # hub: faixa de progresso (GraosBar) + grid de jogos
├── quiz.tsx             # lógica atual de quiz.tsx, movida quase intacta
└── ordem.tsx            # jogo novo "Ordene o preparo"

client/src/lib/play/
├── games.ts             # registro dos jogos: key, título i18n, ícone, rota, peso de Grãos
├── ordem-data.ts        # métodos + passos ordenados { fr, pt } (V60 agora; Chemex depois)
└── graos.ts             # regras puras e testáveis: Grãos/partida, faixas de nível,
                         #   cálculo de badge/streak — compartilhado client/server

server/play/
└── graos.ts             # aplica regras no servidor (teto diário, persistência) — com testes
```

- `client/src/lib/quiz-data.ts` permanece onde está.
- Mover o quiz é **recorte**, não reescrita: o componente e sua lógica de estado
  ficam iguais; só mudam os imports e o caminho.

---

## Seção 3 — Jogo "Ordene o preparo"

### Dados (`client/src/lib/play/ordem-data.ts`)

```ts
interface OrdemMethod {
  key: string;                       // "v60"
  name: { fr: string; pt: string };
  steps: { fr: string; pt: string }[];  // ordem CORRETA
}
```

- **V60** nesta fase (~6 passos): molhar o filtro e descartar a água · adicionar
  o pó e nivelar · bloom (2× o peso do pó, 30–45 s) · primeira adição em espiral ·
  segunda adição até o peso final · aguardar o drawdown.
- **Chemex** depois: só adicionar um objeto `OrdemMethod`. Sem mudança de código.
- Textos derivados/alinhados com `client/src/pages/library-v60.tsx`. Bilíngue.

### Interação

1. Passos exibidos embaralhados numa lista vertical.
2. Toque num passo o seleciona; toque em outro **troca os dois de lugar**.
   Alternativa acessível: setas ↑ / ↓ em cada item.
3. Botão **"Conferir"**: marca cada posição como certa/errada.
4. Usuário reordena e confere de novo quantas vezes quiser.
5. Concluído quando todas as posições estão certas.

### Pontuação

- `firstTry` = acertou tudo na primeira conferência.
- Grãos: peso do jogo `ordem-v60` × 2 se `firstTry`, × 1 caso contrário
  (ver Seção 4).
- `correct` = nº de passos na posição certa na conferência final; `total` = nº de passos.

### UI

- `Card`, `Button` do shadcn/ui; animação de swap com Framer Motion (já instalado).
- **Sem dependência nova** (tap-to-reorder, não drag-and-drop).

---

## Seção 4 — Camada "Grãos" (banco + API)

### Schema (aditivo — `shared/schema.ts`)

**`play_progress`** — um registro por usuário:

| coluna | tipo | notas |
|---|---|---|
| `id` | varchar pk `gen_random_uuid()` | |
| `userId` | varchar → `users.id` | único |
| `totalGraos` | integer notNull default 0 | |
| `currentStreak` | integer notNull default 0 | dias consecutivos com ≥ 1 partida |
| `lastPlayedDate` | date | para cálculo de streak |
| `badges` | jsonb notNull default `[]` | array de keys |
| `updatedAt` | timestamp defaultNow | |

**`play_sessions`** — um registro por partida (base para teto diário e torneio futuro):

| coluna | tipo | notas |
|---|---|---|
| `id` | varchar pk `gen_random_uuid()` | |
| `userId` | varchar → `users.id` | |
| `gameKey` | varchar notNull | `quiz-basic`, `quiz-intermediate`, `quiz-advanced`, `ordem-v60`, … |
| `graosEarned` | integer notNull | após teto diário |
| `correct` | integer notNull | |
| `total` | integer notNull | |
| `playedAt` | timestamp defaultNow | |

Relations análogas às de `quizResults` (`one(users, …)`).
`quiz_results` **não muda**.

### Regras (`client/src/lib/play/graos.ts` — puras, compartilhadas)

- **Grãos por partida** = `correct × peso`:
  - `quiz-basic` ×1 · `quiz-intermediate` ×2 · `quiz-advanced` ×3
  - `ordem-v60` ×2 se `firstTry`, senão ×1
- **Níveis** por Grãos acumulados:
  `0` Semente · `100` Broto · `300` Barista · `700` Barista Sênior · `1500` Mestre
  (constante `GRAOS_LEVELS`, ajustável).
- **Badges Fase 1** (derivados de marcos):
  - `first-game` — primeira partida registrada
  - `quiz-perfect` — gabaritou qualquer nível de quiz
  - `ordem-v60-clean` — ordenou o V60 sem erro (`firstTry`)
  - `streak-7` — 7 dias consecutivos
- **Streak**: mesma data que `lastPlayedDate` → não muda; dia seguinte → +1;
  gap ≥ 2 dias → volta para 1.
- **Teto diário** = `GRAOS_DAILY_CAP` = 150. Soma de `graosEarned` do dia
  (via `play_sessions`) não passa disso; excedente é truncado.

### API (`server/routes.ts` + `server/storage.ts` + `server/play/graos.ts`)

- **`POST /api/play/session`** (`isAuthenticated`)
  Body: `{ gameKey, correct, total, firstTry? }`.
  - Servidor **recalcula** os Grãos a partir de `gameKey`/`correct`/`firstTry` —
    nunca confia num valor de Grãos vindo do cliente.
  - Aplica teto diário consultando `play_sessions` do dia.
  - Atualiza streak e badges; grava `play_sessions` + upsert `play_progress`.
  - Retorna o progresso atualizado (`totalGraos`, nível, `currentStreak`,
    `badges`, `graosEarned` desta partida, `leveledUp`, `newBadges`).
- **`GET /api/play/progress`** (`isAuthenticated`) — estado para `/play` e `/profile`.
- Quiz mantém `POST /api/quiz-results` (histórico) **e** passa a chamar
  `POST /api/play/session` com `gameKey` = `quiz-<level>`.
- Lógica de teto/nível/streak/badges isolada em `server/play/graos.ts`, testada.

---

## Seção 5 — UI de progresso

- **`/play` (topo)** — componente `GraosBar`:
  nível atual · barra de progresso até o próximo nível · total de Grãos ·
  até 3 badges recentes. Só para logados.
  Visitante vê CTA "entre para acumular Grãos".
- **`/profile`** — bloco compacto (Grãos, nível, streak) abaixo do conteúdo
  atual (`client/src/pages/profile.tsx`, 86 linhas).
- **Após cada partida (logado):** toast "+X Grãos"; se `leveledUp` ou `newBadges`,
  card de celebração com Framer Motion.
- **Deslogado:** mantém o card "faça login para salvar seu progresso" que o quiz
  já exibe hoje.

---

## Seção 6 — i18n (`client/src/lib/i18n.tsx`)

- Renomear namespace `quiz.*` → `play.quiz.*` (34 chaves, FR + PT-BR) e atualizar
  os usos em `client/src/pages/play/quiz.tsx`.
- Novas chaves:
  - `nav.play`
  - `play.title`, `play.subtitle`
  - `play.graos.*` — rótulo "Grãos", nomes de nível, "teto diário atingido",
    "entre para acumular"
  - `play.ordem.*` — título, instrução, botão "Conferir", nomes de método e
    passos (V60)
  - `play.badge.*` — nome + descrição de cada badge
- Regra de review: nenhuma chave `play.*` faltando em FR **ou** PT-BR.

---

## Seção 7 — Testes e deploy

### Testes

- **Unit (Vitest) — `client/src/lib/play/graos.ts` e `server/play/graos.ts`:**
  - Grãos por partida para cada `gameKey` e para `ordem` com/sem `firstTry`.
  - Transições de nível nas fronteiras (99→100, 299→300, …).
  - Teto diário: partidas que somam além de 150 truncam corretamente.
  - Streak: mesmo dia não incrementa; dia seguinte +1; gap zera para 1.
  - Badges: cada marco atribui a key certa e não duplica.
- **Server — `POST /api/play/session`:**
  - Teto aplicado.
  - Grãos calculados no servidor ignoram valor enviado pelo cliente.
  - `play_sessions` gravada e `play_progress` atualizada (streak persiste).

### Migration / deploy

- `drizzle-kit push` num banco de dev primeiro. Só `CREATE TABLE` — reversível.
- Deploy é auto no push para `main`. Trabalhar no branch
  `feat/play-section-fase-1`, validar, e só então merge.

---

## Unidades e interfaces (resumo)

| Unidade | O que faz | Depende de |
|---|---|---|
| `lib/play/games.ts` | catálogo de jogos (metadados + peso de Grãos) | i18n |
| `lib/play/ordem-data.ts` | passos corretos por método | — |
| `lib/play/graos.ts` | regras puras: Grãos, nível, streak, badges | `games.ts` |
| `pages/play/index.tsx` | hub + `GraosBar` | `games.ts`, `GET /api/play/progress` |
| `pages/play/quiz.tsx` | quiz (lógica atual) | `quiz-data.ts`, `POST /api/quiz-results`, `POST /api/play/session` |
| `pages/play/ordem.tsx` | jogo de ordenação | `ordem-data.ts`, `POST /api/play/session` |
| `server/play/graos.ts` | aplica regras + teto + persistência | `lib/play/graos.ts`, `storage` |
| rotas `/api/play/*` | HTTP | `server/play/graos.ts`, `isAuthenticated` |
