# School ERP — Progress Log

Keep this file updated after every phase. Upload the latest version to the
Claude Project's knowledge so future chats pick up exactly where this left off.

---

## Project Setup

- **Stack decided:** Next.js (frontend) + Express.js + MongoDB (backend) — two separate repos
- **Repos:**
  - `school-erp-backend` — Node.js + Express + MongoDB + Mongoose
  - `school-erp-frontend` — Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **Package manager:** Yarn (both repos ship with `yarn.lock`, use `yarn install` / `yarn dev`)
- **Source of truth docs:** uploaded `school-ERP-files.zip`
  - `CLAUDE-MASTER-PROMPT.md`
  - `Color_pallte.md`
  - `school_erp_roles_and_dashboards.md` (9 roles)
  - `Core School ERP. Backend. Business. Database/00-29` (full module specs, roadmap, folder structure)
  - `UI. UX. Frontend. Interaction/` (UI instructions + demo images)

---

## Phase 0 — Project Foundation ✅ COMPLETE

**Date:** 2026-08-17

### Backend (`school-erp-backend`)
- Folder structure created exactly per `03-folder-structure.md`
  (config, routes, modules, middlewares, services, utils, helpers,
  constants, validators, database, jobs, sockets, storage, emails,
  templates, types, shared)
- `src/config/`: server.js, database.js, jwt.js, cookie.js, cors.js, security.js, logger.js (winston)
- `src/database/connection.js`: Mongoose connection with error/disconnect handling + graceful shutdown
- `src/shared/`: ApiError.js, ApiResponse.js, asyncHandler.js
- `src/middlewares/`: error.middleware.js, notFound.middleware.js, rateLimit.middleware.js
- `src/routes/v1/index.js`: API versioning entry point (`/api/v1/health`)
- `src/app.js`: Express app — helmet, cors, hpp, rate limiting, morgan logging, body/cookie parsing
- `src/server.js`: entry point with graceful shutdown (SIGTERM/SIGINT) + unhandled rejection handling
- `package.json` with dependencies: express, mongoose, jsonwebtoken, bcryptjs, cookie-parser,
  cors, helmet, hpp, express-rate-limit, morgan, winston, zod, dotenv
- `.env.example`, `.gitignore`, `README.md`
- **Verified:** dependencies install cleanly, `app.js` loads with no syntax/import errors

### Frontend (`school-erp-frontend`)
- Scaffolded with `create-next-app`: TypeScript, Tailwind CSS 4, App Router, `src/` dir, ESLint
- Full design system wired into `src/app/globals.css` from `Color_pallte.md`:
  primary/accent/neutral/typography/chart/status colors, dark mode palette,
  border radius tokens (12px card / 8px control / pill)
- Fonts: Poppins (headings) + Inter (body) via `next/font/google`
- Folder structure: `components/ui`, `components/layout`, `features`, `lib`, `hooks`, `store`, `types`, `config`
- `src/lib/api-client.ts`: typed fetch wrapper matching backend's `ApiResponse` shape
- `.env.local.example` with `NEXT_PUBLIC_API_URL`
- Homepage (`src/app/page.tsx`) demonstrating the wired-in design tokens
- **Verified:** `tsc --noEmit` clean, `eslint` clean, production build succeeds

### Not yet done (deliberately out of scope for Phase 0)
- No auth, no database models, no real UI screens yet — that's Phase 1+
- Demo images / UI instruction docs not yet reviewed screen-by-screen — do this before Phase 1 UI work starts

---

## Next Up — Phase 1: Authentication & Authorization

Per `28-roadmap.md`: Authentication, RBAC, User Management, Permission System,
Email Verification, Password Reset, Refresh Token, Session Management.

Relevant spec docs to re-read before starting: `04-authentication.md`, `05-rbac.md`,
`06-user-management.md`, `school_erp_roles_and_dashboards.md`.
