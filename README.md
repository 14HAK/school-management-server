# School ERP — Backend

Node.js + Express.js + MongoDB backend for the School ERP system.

## Phase Status

- [x] Phase 0 — Project Foundation
- [ ] Phase 1 — Authentication & Authorization
- [ ] Phase 2 — Campus Management
- [ ] Phase 3 — Academic Management
- [ ] ... (see `docs/PROGRESS-LOG.md`)

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (access + refresh tokens, cookie-based)
- Winston (logging)
- Zod (validation — wired in from Phase 1)
- Helmet, HPP, express-rate-limit (security)

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`.
3. Run in development:
   ```bash
   yarn dev
   ```
4. Health check:
   - `GET /` → API root status
   - `GET /api/v1/health` → Versioned API health check

## Folder Structure

Follows `03-folder-structure.md` from the project spec. See that document
for the full architecture, module structure, and naming conventions.

## Architecture Flow

```
Controller → Service → Repository → Model → Database
```

Business logic lives in the service layer. Controllers stay thin.
No database queries in routes. No validation in controllers.
