# Q-Coffee-Atelier (O Baristech) — CLAUDE.md

## Visão Geral

PWA mobile-first bilíngue (Français / Português-BR) para workshops de degustação de café. Usuários se identificam (nome + e-mail, sem senha), registram degustações, veem seu perfil sensorial, pedem sugestões a um chatbot com IA, exploram cafeterias locais, fazem quiz de conhecimento e acessam uma biblioteca educacional. O app também vende ateliers presenciais (crianças, degustação a domicílio/espaço privado, team building para empresas, e um atelier de tecnologia/IA) com páginas de venda dedicadas e um fluxo de reserva.

**Estado atual:** em produção, deploy ativo no Railway (`app.obaristech.com`), banco Postgres real hospedado no Supabase (usado só como Postgres, sem Supabase Auth/SDK).

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
| Banco | PostgreSQL via Supabase (só o Postgres — sem `@supabase/supabase-js`) |
| Auth | Fluxo próprio e leve — ver seção Autenticação abaixo |
| IA | Anthropic API (`@anthropic-ai/sdk`) — chatbot em `/summary` |
| Sessions | express-session + connect-pg-simple |
| Deploy | Railway, auto-deploy no push pra `main` do GitHub |

---

## Autenticação (correção importante)

**Não é Replit OIDC nem Supabase Auth.** É um fluxo próprio, sem senha:
- `POST /api/auth/identify` recebe `{name, email}`, faz upsert em `users` por e-mail, seta `req.session.userId`.
- Sessão via `express-session` + `connect-pg-simple` (tabela `sessions` no Postgres).
- Middleware `isAuthenticated` (`server/auth/index.ts`) — usado em toda rota protegida.
- Admin é **separado**: `req.session.isAdmin`, login próprio em `/api/admin/login` com `ADMIN_EMAIL`/`ADMIN_PASSWORD_HASH`. Não tem relação com `req.user`.

---

## Estrutura de Arquivos

```
projetos/baristech/
├── client/
│   ├── public/               # arquivos estáticos servidos sem hash (favicon, manifest, email/*)
│   │   └── email/            # campanhas de e-mail marketing hospedadas (imagens + HTML "ver no navegador")
│   └── src/
│       ├── components/
│       │   ├── ui/              # 50+ componentes shadcn/ui
│       │   ├── app-header.tsx   # Header: logo (→ home "/"), nav desktop (md+), lang/theme toggle, user menu
│       │   ├── mobile-nav.tsx   # Bottom nav mobile (md:hidden), usa useNavItems()
│       │   ├── chat-widget.tsx  # Widget de chat IA, embutido em summary.tsx
│       │   └── tasting-wizard.tsx
│       ├── hooks/
│       │   ├── use-auth.ts       # user, identify, logout
│       │   └── use-nav-items.ts  # itens de navegação compartilhados entre mobile-nav e app-header (desktop)
│       ├── lib/
│       │   ├── i18n.tsx          # 250+ chaves FR/PT-BR, persiste em localStorage
│       │   ├── constants.ts      # Aroma tags, métodos, ATELIER_THEMES (banners de /ateliers), AI_LEVELS, TECH_GOALS
│       │   ├── quiz-data.ts
│       │   └── queryClient.ts    # apiRequest helper (cookie de sessão)
│       └── pages/
│           ├── landing.tsx           # Home pública ("/") — hero + login OU botão "ir pro diário" se já logado
│           ├── journal.tsx           # Diário de degustações — rota "/journal" (não é mais "/")
│           ├── summary.tsx           # Perfil sensorial + chatbot IA
│           ├── spots.tsx
│           ├── quiz.tsx
│           ├── library.tsx / library-v60.tsx / library-chemex.tsx / library-torrefaction.tsx
│           ├── ateliers.tsx          # Listagem + carrossel de banners + dialog de reserva (multi-modo de perguntas)
│           ├── ateliers-enfants.tsx        # Venda: atelier pintura com café (crianças)
│           ├── ateliers-domicile.tsx       # Venda: atelier a domicílio / espaço privado
│           ├── ateliers-team-building.tsx  # Venda: atelier team building (empresas)
│           ├── ateliers-cafe-tech.tsx      # Venda: atelier IA/automação (empresas + autônomos)
│           └── admin-dashboard.tsx
├── server/
│   ├── index.ts               # Bootstrap Express
│   ├── routes.ts              # Todas as rotas API (um arquivo só, sem "API routes" à la Next.js)
│   ├── chat-context.ts        # Monta o system prompt do chatbot (perfil sensorial + coffee spots + conhecimento de terroir)
│   ├── auth/index.ts          # identify, isAuthenticated, setupAuth
│   ├── storage.ts             # Camada de acesso ao banco (IStorage)
│   ├── db.ts                  # Instância Drizzle
│   ├── email.ts               # Envio de e-mails transacionais (Resend) — confirmação/notificação de reserva
│   └── seed.ts                # Seed inicial (coffee spots, library modules)
├── shared/
│   ├── schema.ts              # Tabelas Drizzle principais
│   └── models/auth.ts         # users, sessions
├── drizzle.config.ts
└── vite.config.ts             # Aliases: @/* → client/src, @assets/* → attached_assets/
```

---

## Rotas do Frontend (Wouter)

| Rota | Página | Auth |
|------|--------|------|
| `/` | **Home** (landing.tsx) — hero, login OU CTA "ir pro diário" se logado, rodapé com contato (cris@obaristech.com) | — |
| `/journal` | Diário de degustações | Sim |
| `/summary` | Perfil sensorial + **chatbot IA** | Sim |
| `/spots` | Diretório de cafeterias | Sim |
| `/quiz` | Quiz 3 níveis | Sim |
| `/library`, `/library/v60`, `/library/chemex`, `/library/torrefaction` | Módulos educacionais | Pública (visitante) |
| `/ateliers` | Listagem + banners + reserva | Pública (visitante) |
| `/ateliers-enfants`, `/ateliers-domicile`, `/ateliers-team-building`, `/ateliers-cafe-tech` | Páginas de venda por atelier | Pública (visitante) |
| `/admin-panel` | Dashboard admin | Admin only |

**Importante:** `/` deixou de ser o Diário (era antes) — agora é sempre a home/landing, pra visitante ou logado. O Diário só está em `/journal`. O logo no header sempre leva pra `/`.

**Navegação:** mobile usa bottom tab bar (`mobile-nav.tsx`, escondida em `md+`); desktop mostra os mesmos itens compactos no header, ao lado do logo (`app-header.tsx`). Ambos usam `useNavItems()`.

---

## Chatbot (Anthropic API) — `/summary`

- Rota: `POST /api/chat`, protegida por `isAuthenticated`.
- Modelo configurável via `ANTHROPIC_MODEL` (default `claude-sonnet-4-5-20250929`).
- `server/chat-context.ts` monta o system prompt com: persona "Baristech" (tom próximo/sensorial, respostas curtas), perfil sensorial real do usuário (`getTastingSummary`), histórico de quiz, **lojas parceiras reais** (`getCoffeeSpots` — recomenda com link real quando perguntam onde comprar), e conhecimento geral de terroir/regiões produtoras do mundo (vem do próprio modelo, não do banco).
- Sem streaming (resposta completa via `res.json`).
- Frontend: `client/src/components/chat-widget.tsx`, embutido só em `summary.tsx` (piloto isolado, ainda não expandido pro app inteiro).

---

## Ateliers — páginas de venda + reserva

4 ateliers com página de venda dedicada (todas seguem o mesmo template: hero + facts + steps + benefícios/diferenciais + galeria + FAQ + CTA final):

| Atelier | Rota | Tema (`theme`) | Modo de perguntas na reserva |
|---|---|---|---|
| Crianças (pintura com café) | `/ateliers-enfants` | `peinture-enfants` | `kids` (idade das crianças, acompanhado de adulto) |
| A domicílio / espaço privado | `/ateliers-domicile` | `domicile`, `espace-prive` | `coffee` (conhecimento de café, método em casa, objetivo) |
| Team building | `/ateliers-team-building` | `team-building` | `team` (empresa, objetivo do evento) |
| Café Tech (IA, automação, sites/apps) | `/ateliers-cafe-tech` | `cafe-tech` | `tech` (nível de relação com IA, objetivo, contexto do negócio) |

O carrossel de banners em `/ateliers` usa `ATELIER_THEMES` (`client/src/lib/constants.ts`) — cada tema tem `image` (foto de fundo, overlay azul ~60%) e opcionalmente `desktopImage` (crop diferente só pra telas `md+`, pra banners largos não ficarem esticados). O reservation dialog (`ateliers.tsx`) decide o `questionsMode` a partir de `atelier.theme` e mostra só as perguntas daquele modo.

Reservas ficam na tabela `atelier_reservations` — campos condicionais por modo: `coffeeKnowledge/homeBrewMethod/learningGoal` (coffee), `companyName/eventGoal` (team), `childAges/parentAccompanying` (kids), `aiLevel/techGoal/techContext` (tech). Notificação por e-mail (`server/email.ts`) lista os campos preenchidos conforme o modo.

---

## E-mail marketing

Campanhas HTML ficam em `client/public/email/<nome-da-campanha>/` — arquivos servidos com URL estável (sem hash), então imagens e o link "ver no navegador" não quebram entre deploys. Enviado via Gmail (MCP conectado). Ver campanha de exemplo em `client/public/email/cafe-tech-launch/` (ateliers pra empresas — team building + Café Tech).

**Saudação personalizada:** o template tem um placeholder `Bonjour {{nome}},` no topo do e-mail — antes de cada envio, trocar `{{nome}}` pelo nome real do destinatário (ex: `Bonjour Madame Chal-Duarte,`) no HTML que vai no `htmlBody` do envio. Pra lista grande (mail merge automático), ver opção de usar o Resend (`server/email.ts`) já configurado no backend, em vez de enviar um por um via Gmail.

---

## Comandos

```bash
npm run dev       # Dev server (Express + Vite HMR) na porta 3001 (local) / definida por PORT
npm run build     # Build produção → dist/index.cjs + dist/public
npm start         # Inicia produção
npm run db:push   # Aplica schema (shared/schema.ts) ao banco PostgreSQL — não precisa de migration manual
npm run check     # Validação TypeScript
```

**Fluxo de deploy:** commit + `git push origin main` → Railway detecta e faz build/deploy automático. Verificar propagação comparando o hash do bundle (`assets/index-XXXX.js`) servido em produção antes/depois do push — pode levar de alguns segundos a ~4 min.

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL connection string (pooler Supabase) |
| `SESSION_SECRET` | Secret do express-session |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` | Login do admin |
| `ANTHROPIC_API_KEY` | Chave da API Anthropic (chatbot) — configurada no Railway |
| `ANTHROPIC_MODEL` | Opcional, override do modelo (default `claude-sonnet-4-5-20250929`) |
| `RESEND_API_KEY` / `EMAIL_FROM` / `ADMIN_NOTIFICATION_EMAIL` | E-mails transacionais de reserva |
| `SUPABASE_URL`, `VITE_SUPABASE_URL`, `*_SUPABASE_*` | Presentes no `.env` mas **não usados no código** — Supabase é só o host do Postgres |
| `NODE_ENV`, `PORT` | Padrão Express/Railway |

---

## Notas Importantes

**i18n:** Sistema custom sem biblioteca externa. Contexto em `client/src/lib/i18n.tsx`. Idioma padrão: francês. Persiste em `localStorage`. Toda string nova precisa das duas línguas.

**Tasting Summary:** Algoritmo em `server/storage.ts` (`getTastingSummary`) — calcula método favorito, top aroma tags, médias de acidez/amargor/doçura, dica personalizada. É o mesmo dado usado pelo chatbot.

**Admin:** `req.session.isAdmin`, sem relação com `req.user`/login de usuário comum.

**Background color:** `#EDEFED` (definido no CSS global). **Cor primária:** azul `#1E39B0` (`hsl(232 76% 55%)`), texto sobre foto/banner em cream `#F0DAB2`.

**Processamento de imagem:** usar **Python Pillow**, nunca `sips` pra rotacionar+redimensionar junto (sips reverte a rotação quando combinado com resize — bug confirmado). Fotos de celular geralmente têm EXIF de orientação — usar `ImageOps.exif_transpose()` antes de salvar, senão a imagem pode sair deitada/rotacionada errado mesmo com pixels "corretos" a olho nu no preview local.

**PWA:** Manifesto configurado. Mobile-first com bottom nav de 6 tabs (Diário, Resumo, Workshops, Coffee Spots, Biblioteca, Quiz) — some em telas `md+`, substituída pela nav compacta no header.

---

## Histórico recente (últimas sessões)

Registro cronológico do que foi construído, pra não perder contexto entre conversas:

1. **Páginas de venda dos ateliers** — criadas as 4 páginas dedicadas (crianças, domicílio/espaço-privado, team building, café tech), todas seguindo o mesmo template visual, com fotos reais processadas (crop + compressão via Pillow), deep-link de reserva (`/ateliers?reservar=<theme>`) e fluxo de login preservando a intenção (`?next=`).
2. **Chatbot com Anthropic API** — avaliação técnica completa do stack (corrigindo a suposição inicial de Next.js/Supabase Auth), implementação em fases: rota `/api/chat` → contexto pessoal (`getTastingSummary`) → widget piloto isolado em `/summary`. Persona "Baristech", tom próximo/sensorial, respostas curtas. Depois enriquecido com conhecimento de terroir multi-origem e recomendação de lojas parceiras reais (`getCoffeeSpots`).
3. **Atelier Café Tech (novo)** — criado do zero (sem roteiro prévio, a partir de uma descrição breve): página de venda, tema no carrossel de `/ateliers`, e um **formulário de reserva dedicado** (`questionsMode: "tech"`) com perguntas de nível de IA/objetivo/contexto do negócio — incluiu migration de banco (`ai_level`, `tech_goal`, `tech_context` em `atelier_reservations`) e atualização do e-mail de notificação interno.
4. **Ajustes visuais nos banners de `/ateliers`** — fotos de fundo por tema, opacidade do overlay azul ajustada (70% → 50% → 60% de azul, testado até o efeito "azulado" desejado), correção de rotação EXIF numa foto, e imagem dedicada por tema (`desktopImage`) pra banners largos não esticarem no desktop.
5. **Navegação** — reordenada (Diário, Resumo, Workshops, Coffee Spots, Biblioteca, Quiz), espaçamento entre ícones corrigido (era `flex-1` com larguras iguais gerando espaço desigual entre labels curtos/longos; trocado por `justify-between` com itens de largura natural), e criada versão desktop compacta no header (nav some do rodapé em telas `md+`).
6. **Reestruturação de rotas** — `/` deixou de mostrar o Diário pra usuários logados (comportamento inconsistente com visitantes); agora `/` é sempre a home/landing (com botão "ir pro diário" se já logado), e o Diário ganhou rota própria `/journal`, no padrão de `/summary`.
7. **E-mail marketing B2B** — campanha HTML (tabelas + CSS inline, compatível com clientes de e-mail) promovendo os ateliers Team Building e Café Tech pra empresas, com vídeo (gerado por IA) representado como imagem+botão de play linkando pra página real (e-mail não toca vídeo nativo). Assets hospedados em `client/public/email/`. Enviado via Gmail conectado.
8. **Pequenos ajustes de copy/UI** — remoção do módulo "Grand Maître du Café" da Biblioteca, "Meu Resumo"/"Mon Résumé" → "Resumo"/"Résumé", "Meu Diário..." → "Diário...", "Boutique en ligne" com "(nós recomendamos)", e-mail de contato (`cris@obaristech.com`) adicionado ao rodapé da home.
