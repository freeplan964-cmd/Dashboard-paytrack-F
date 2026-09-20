# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-09-20

### Added
- **Stateless JWT Authentication** — Zero-dependency HMAC-SHA256 tokens stored in `HttpOnly` cookies using Node.js built-in `crypto`.
- **`scrypt` Password Hashing** — Memory-hard, constant-time password verification. No plain-text passwords stored.
- **Login page** (`/login`) — Clean, accessible login form with show/hide password toggle and error display.
- **Sign-out API** (`POST /api/auth/logout`) — Clears the session cookie securely.
- **Auth abstraction layer** — `lib/auth/jwt.ts`, `lib/auth/password.ts`, `lib/auth/session.ts`, `lib/auth/authorize.ts`.
- **Typed Payroll Domain** — `PayrollInput` / `PayrollResult` interfaces enforce strict contracts between the calculator, API, and UI.
- **Tax double-count guard** — Statutory tax is now isolated from manual deductions; a runtime guard throws if `tax` appears in `deductionFields`.
- **`netSalary` floor** — Net salary can never go below zero, even if deductions exceed gross.
- **Jest unit tests** — 25 tests covering all tax brackets, edge cases, decimal values, and the double-count prevention.
- **`ts-jest` + `ts-node`** — Full TypeScript test pipeline with path alias support.
- **`DashboardStats` DTO** — Typed API contract shared between the stats API and the dashboard UI.
- **Sign-out button** in the workspace layout header.
- **`LICENSE`** file (MIT).

### Changed
- All protected API routes now use `requireSession()` with no request argument (reads cookie automatically).
- `features/payroll/domain/calculator.ts` fully rewritten with explicit types and separated deduction logic.
- `config/schemas.ts` — Added `manualDeductions` field to payroll record schema.
- `app/(workspace)/dashboard/page.tsx` — State variables typed with `DashboardStats | null` and `Record<string, unknown>[]`.
- `app/(workspace)/layout.tsx` — Added `LogOut` button with proper `handleSignOut` function.
- `package.json` — Added `jest`, `@types/jest`, `ts-jest`, `ts-node` as dev dependencies; added `test` script.
- Bumped `@tanstack/react-table` from `8.21.3` → `9.2.4`.
- Bumped GitHub Actions: `actions/cache@v6`, `actions/checkout@v7`, `actions/setup-node@v7`.

### Removed
- `backend_test.py` — Leftover Python script, not part of the Next.js application.
- `jsconfig.json` — Superseded by `tsconfig.json`.
- `package-lock.json` — Project uses `pnpm`; npm lockfile was redundant and conflicting.
- `tests/__init__.py` — Leftover Python test scaffold, empty and irrelevant.

---

## [0.1.0] - 2026-09-20

### Added
- Initial project setup with Next.js App Router + TypeScript.
- Dashboard UI with responsive layout.
- Employee management system.
- Payroll calculation engine.
- Analytics dashboard with department breakdown.
- Dark/Light theme toggle.
- Centralized configuration system (`config/app.ts`, `config/environment.ts`).
- Comprehensive Zod validation schemas.
- API routes for employees, payroll, and analytics.
- MongoDB client wrapper.
- GitHub CI/CD workflows and automated release process.
- Docker standalone build support.
