# Q-Coffee-Atelier — CLAUDE.md

## Visão Geral

PWA mobile-first bilíngue (Français / Português-BR) para workshops de degustação de café. Usuários fazem login, registram degustações, veem seu perfil sensorial, exploram cafeterias locais, fazem quiz de conhecimento e acessam uma biblioteca educacional sobre café.

**Estado atual:** UI 100% completa, API completa, schema do banco definido. Falta conectar o banco (Supabase), migrar autenticação do Replit Auth → Supabase Auth e fazer deploy no Railway.

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript + Wouter (routing) |
| State | TanStack Query (React Query v5) |
| UI | Shadcn/ui + Radix UI + Tailwind CSS |
| Forms | React Hook Form + Zod |
| Animações | Framer Motion |
| i18n | Sistema custom FR/PT-BR (sem biblioteca externa) |
| Build | Vite 7 |
| Backend | Express 5 + TypeScript |
| ORM | Drizzle ORM |
| Banco | PostgreSQL via Supabase |
| Auth | Supabase Auth (a migrar — atualmente Replit OIDC) |
| Sessions | express-session + connect-pg-simple |
| Deploy | Railway |

---

## Estrutura de Arquivos

```
Q-Coffee-Atelier/
├── client/src/
│   ├── components/
│   │   ├── ui/              # 50+ componentes shadcn/ui
│   │   ├── app-header.tsx   # Header com logo, lang toggle, theme toggle
│   │   ├── mobile-nav.tsx   # Bottom nav (5 tabs)
│   │   └── tasting-wizard.tsx # Form wizard 4 passos
│   ├── hooks/
│   │   └── use-auth.ts      # Hook de autenticação (a migrar p/ Supabase)
│   ├── lib/
│   │   ├── i18n.tsx         # 140+ chaves FR/PT-BR, persiste em localStorage
│   │   ├── constants.ts     # Aroma tags, métodos de preparo, URLs externas
│   │   ├── quiz-data.ts     # Perguntas dos 3 níveis do quiz (FR+PT)
│   │   └── queryClient.ts   # TanStack Query client + apiRequest helper
│   └── pages/
│       ├── landing.tsx      # Tela de boas-vindas (visitante)
│       ├── journal.tsx      # Diário de degustações (home logado)
│       ├── summary.tsx      # Perfil sensorial + dicas personalizadas
│       ├── spots.tsx        # Diretório de cafeterias
│       ├── quiz.tsx         # Quiz 3 níveis
│       ├── library.tsx      # Módulos educacionais
│       └── admin-dashboard.tsx # Painel admin (stats, users, CRUD conteúdo)
├── server/
│   ├── index.ts             # Inicialização Express
│   ├── routes.ts            # 25+ endpoints API
│   ├── storage.ts           # Camada de acesso ao banco (IStorage interface)
│   ├── db.ts                # Instância Drizzle ORM
│   ├── seed.ts              # Seed inicial (5 spots, 6 módulos biblioteca)
│   └── replit_integrations/ # AUTH ATUAL — REMOVER ao migrar para Supabase
│       └── auth/
├── shared/
│   ├── schema.ts            # Tabelas Drizzle: user_profiles, tasting_entries,
│   │                        # coffee_spots, quiz_results, library_modules
│   └── models/auth.ts       # Tabelas: users, sessions (Replit Auth)
├── drizzle.config.ts        # Config Drizzle (aponta para DATABASE_URL)
└── vite.config.ts           # Aliases: @/* → client/src, @shared/* → shared
```

---

## Schema do Banco (Drizzle ORM)

### `users` (shared/models/auth.ts)
```
id (varchar PK, uuid auto)  email (varchar unique)
firstName, lastName         profileImageUrl
createdAt, updatedAt
```
> Ao migrar para Supabase Auth, adicionar campo `role varchar default 'user'`

### `sessions` (shared/models/auth.ts)
```
sid (varchar PK)  sess (jsonb)  expire (timestamp, indexed)
```
> Pode ser removida quando migrar para Supabase Auth (Supabase gerencia sessões)

### `user_profiles` (shared/schema.ts)
```
userId (FK users PK)  whatsapp  displayName
rgpdConsent (bool)    preferredLanguage (default 'fr')
```

### `tasting_entries` (shared/schema.ts)
```
id (uuid PK)    userId (FK users)     coffeeName (required)
origin          variety               process
roastDate       method (required)     methodOther
aromaTags[]     acidity/bitterness/sweetness (1-5, default 3)
notes           favoriteMethod (bool) wouldDrinkAgain (yes/no/maybe)
createdAt
```

### `coffee_spots` (shared/schema.ts)
```
id (uuid PK)  name (required)  city (required)
instagram     website           tags[]
approved (bool default true)   createdAt
```

### `quiz_results` (shared/schema.ts)
```
id (uuid PK)  userId (FK)  level (basic/intermediate/advanced)
score         totalQuestions                completedAt
```

### `library_modules` (shared/schema.ts)
```
id (uuid PK)  key (unique)  titleFr/titlePt  descFr/descPt
contentFr/contentPt (markdown)  icon  sortOrder
isActive (bool)  externalUrl
```

---

## API Routes (server/routes.ts)

### Públicas
```
GET  /api/health          — Health check
GET  /api/auth/user       — Usuário atual (null se não logado)
GET  /api/coffee-spots    — Cafeterias aprovadas
GET  /api/library-modules — Módulos ativos
```

### Auth (Replit — a substituir por Supabase)
```
GET /api/login    → Redirect Replit OIDC
GET /api/callback → OAuth callback
GET /api/logout   → Logout
```

### Protegidas (usuário logado)
```
GET    /api/tastings          — Degustações do usuário
POST   /api/tastings          — Criar degustação
DELETE /api/tastings/:id      — Deletar degustação
GET    /api/tastings/summary  — Resumo/perfil sensorial
POST   /api/quiz-results      — Salvar resultado quiz
GET    /api/quiz-results       — Histórico quiz
```

### Admin (session-based — a migrar para Supabase role)
```
POST  /api/admin/login
POST  /api/admin/logout
GET   /api/admin/session
GET   /api/admin/stats
GET   /api/admin/users
GET   /api/admin/tastings
GET|POST|PATCH|DELETE /api/admin/coffee-spots
GET|POST|PATCH|DELETE /api/admin/coffee-spots/:id
GET|POST|PATCH|DELETE /api/admin/library-modules
GET|POST|PATCH|DELETE /api/admin/library-modules/:id
```

---

## Rotas do Frontend (Wouter)

| Rota | Página | Auth |
|------|--------|------|
| `/` | landing (visitante) ou journal (logado) | — |
| `/summary` | Perfil sensorial + dicas | Sim |
| `/spots` | Diretório de cafeterias | Sim |
| `/quiz` | Quiz 3 níveis (basic/intermediate/advanced) | Sim |
| `/library` | Módulos educacionais | Sim |
| `/admin-panel` | Dashboard admin | Admin only |

---

## Comandos

```bash
npm run dev       # Dev server (Express + Vite HMR) na porta 5000
npm run build     # Build produção → dist/index.cjs
npm start         # Inicia produção
npm run db:push   # Aplica schema ao banco PostgreSQL
npm run check     # Validação TypeScript
```

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL connection string do Supabase |
| `SUPABASE_URL` | URL do projeto Supabase (ex: https://xxx.supabase.co) |
| `SUPABASE_ANON_KEY` | Chave pública Supabase (safe para cliente) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave privada (só servidor — nunca expor no cliente) |
| `SESSION_SECRET` | Secret para express-session |
| `NODE_ENV` | development \| production |
| `PORT` | Railway define automaticamente via `process.env.PORT` |

---

## Checklist de Migração Supabase + Deploy Railway

### Passo 1 — Supabase Project Setup
- [ ] Criar projeto em supabase.com
- [ ] Copiar `DATABASE_URL` (Settings > Database > Connection string > URI)
- [ ] Copiar `SUPABASE_URL` e `SUPABASE_ANON_KEY` (Settings > API)
- [ ] Copiar `SUPABASE_SERVICE_ROLE_KEY` (Settings > API > service_role)
- [ ] Criar arquivo `.env` local com essas variáveis
- [ ] Rodar `npm run db:push` para criar todas as tabelas
- [ ] Rodar o seed: `tsx server/seed.ts`

### Passo 2 — Instalar Supabase SDK
```bash
npm install @supabase/supabase-js
```

### Passo 3 — Migrar Autenticação do Servidor
- [ ] Criar `server/auth/supabase.ts` com middleware JWT do Supabase
- [ ] Substituir `server/replit_integrations/auth/` pelas novas rotas
- [ ] Atualizar `server/index.ts` para usar novo auth middleware
- [ ] Adicionar campo `role` na tabela `users`: `varchar role default 'user'`
- [ ] Middleware `isAdmin` passa a verificar `user.role === 'admin'` (não mais `req.session.isAdmin`)
- [ ] Remover dependências Replit: `openid-client`, `passport`, `passport-local`

### Passo 4 — Migrar Autenticação do Cliente
- [ ] Criar `client/src/lib/supabase.ts` com cliente Supabase
- [ ] Atualizar `client/src/hooks/use-auth.ts` para usar Supabase Auth
- [ ] Configurar providers no painel Supabase (Google OAuth ou Magic Link)
- [ ] Atualizar landing.tsx com botão de login Supabase
- [ ] Configurar redirect URL no Supabase: `https://seu-dominio.railway.app/auth/callback`

### Passo 5 — Limpar Replit
- [ ] Deletar `server/replit_integrations/`
- [ ] Remover plugins Replit do `vite.config.ts`:
  - `@replit/vite-plugin-cartographer`
  - `@replit/vite-plugin-dev-banner`
  - `@replit/vite-plugin-runtime-error-modal`
- [ ] Remover dos devDependencies no `package.json`
- [ ] Remover env vars: `REPL_ID`, `ISSUER_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`

### Passo 6 — Railway Deploy
- [ ] Criar projeto Railway em railway.app
- [ ] Conectar repositório GitHub (push o projeto antes)
- [ ] Adicionar todas as variáveis de ambiente no Railway
- [ ] Garantir que `npm start` usa `process.env.PORT` (já configurado)
- [ ] Verificar health check em `/api/health`
- [ ] Testar fluxo completo: login → criar degustação → ver perfil → spots → quiz

---

## Notas Importantes

**i18n:** Sistema custom sem biblioteca externa. Contexto em `client/src/lib/i18n.tsx`. Idioma padrão: francês. Persiste em `localStorage`. Todas as strings novas devem ser adicionadas nas duas línguas.

**Tasting Summary:** Algoritmo em `server/storage.ts` — calcula método favorito por frequência, top 5 aroma tags, médias de acidez/amargor/doçura e gera dica personalizada baseada no perfil.

**Admin:** Atualmente qualquer usuário com `req.session.isAdmin = true` tem acesso. Após migração, checar `user.role === 'admin'` via JWT do Supabase. Definir o primeiro admin diretamente no banco: `UPDATE users SET role = 'admin' WHERE email = 'seu@email.com'`.

**Seed Data:** `server/seed.ts` tem 5 cafeterias (Clermont-Ferrand) e 6 módulos de biblioteca pré-carregados. Rodar após criar as tabelas.

**Background color:** `#EDEFED` (definido no CSS global, não remover).

**PWA:** Manifesto configurado. App é mobile-first com bottom navigation de 5 tabs. Viewport: `h-[100dvh]`.

**URLs externas:** Q Coffee Go e Grand Maître ChatGPT GPT — definidos em `client/src/lib/constants.ts`.
