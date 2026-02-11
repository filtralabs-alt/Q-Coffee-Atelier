# Cris Du Café

## Overview
Mobile-first PWA web app for coffee tasting workshops. Bilingual support (FR / PT-BR), default French.
Built with Express + React + PostgreSQL + Drizzle ORM.

## Recent Changes
- Initial MVP build: auth, journal, summary, coffee spots, quiz, content library
- Bilingual i18n system (FR/PT-BR) with toggle
- Replit Auth integration for authentication
- Database seeded with coffee spots in Clermont-Ferrand
- Mobile UX redesign: bottom nav, compact header, PWA support, welcome screen
- Admin dashboard at /admin-panel with separate email/password auth (bcryptjs hashed)
- Background color updated to #EDEFED

## Architecture
- **Frontend**: React + Wouter routing + TanStack Query + Tailwind + Shadcn UI
- **Backend**: Express API with Drizzle ORM on PostgreSQL
- **Auth**: Replit Auth (OpenID Connect) via `server/replit_integrations/auth/`
- **i18n**: Custom context-based system in `client/src/lib/i18n.tsx`

### Key Files
- `shared/schema.ts` — All Drizzle models (users, tastingEntries, coffeeSpots, quizResults, userProfiles)
- `shared/models/auth.ts` — Auth-specific models (users, sessions)
- `server/routes.ts` — All API endpoints
- `server/storage.ts` — Database storage layer
- `server/seed.ts` — Seed data for coffee spots
- `client/src/lib/i18n.tsx` — Bilingual translation system
- `client/src/lib/quiz-data.ts` — Quiz questions (FR/PT-BR) for 3 levels
- `client/src/lib/constants.ts` — Aroma tags, Q Coffee Go URL, processes, methods

### Pages
- Landing (unauthenticated) — `/`
- Journal (authenticated home) — `/`
- Summary — `/summary`
- Coffee Spots — `/spots`
- Quiz — `/quiz`
- Library — `/library`
- Admin Spots — `/admin`
- Admin Dashboard — `/admin-panel` (separate email/password auth)

### API Routes
- `GET/POST /api/tastings` — User tasting entries
- `DELETE /api/tastings/:id`
- `GET /api/tastings/summary` — Aggregated summary
- `GET/POST /api/coffee-spots`
- `PATCH/DELETE /api/coffee-spots/:id`
- `GET/POST /api/quiz-results`

### Admin API Routes (protected by isAdmin session)
- `POST /api/admin/login` — Admin email/password login
- `POST /api/admin/logout` — Admin logout
- `GET /api/admin/session` — Check admin session
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/users` — All users
- `GET /api/admin/tastings` — All tastings
- `GET/POST /api/admin/coffee-spots` — Coffee spots management
- `PATCH/DELETE /api/admin/coffee-spots/:id`

### Q Coffee Go
External link URL configured in `client/src/lib/constants.ts` as `Q_COFFEE_GO_URL`.

## User Preferences
- Language: Portuguese (BR) for chat
- App default language: French
