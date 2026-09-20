<div align="center">

<br/>

```
██████╗  █████╗ ██╗   ██╗████████╗██████╗  █████╗  ██████╗██╗  ██╗
██╔══██╗██╔══██╗╚██╗ ██╔╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝
██████╔╝███████║ ╚████╔╝    ██║   ██████╔╝███████║██║     █████╔╝
██╔═══╝ ██╔══██║  ╚██╔╝     ██║   ██╔══██╗██╔══██║██║     ██╔═██╗
██║     ██║  ██║   ██║      ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗
╚═╝     ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
```

### Payroll operations, done right.

<br/>

[![CI](https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions/workflows/ci.yml/badge.svg)](https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions/workflows/ci.yml)
[![Docker Publish](https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions/workflows/docker-publish.yml)
[![Tests](https://img.shields.io/badge/tests-25%20passing-brightgreen?logo=jest)](https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions)
[![Docker Image](https://img.shields.io/badge/ghcr.io-paytrack%3Alatest-0ea5e9?logo=docker&logoColor=white)](https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/pkgs/container/paytrack)
[![Release](https://img.shields.io/github/v/release/Mostafa-SAID7/Dashboard-paytrack-F?color=8b5cf6)](https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org/)

<br/>

</div>

---

## What is PayTrack?

PayTrack is a **focused, production-ready payroll dashboard** built with Next.js App Router and TypeScript. It handles the things that matter most in payroll software — mathematical correctness, access control, and clear operational visibility — without unnecessary complexity.

> **Not** a full HR suite. **Not** an accounting system.
> Just payroll, done with precision.

---

## Why PayTrack stands out

<table>
<tr>
<td width="50%">

**🔐 Secure Authentication**

Zero external dependencies. HMAC-SHA256 JWT tokens stored in strict `HttpOnly` cookies. Passwords hashed with `scrypt` — memory-hard, brute-force resistant. Sessions expire automatically. Sign-out invalidates the cookie immediately.

</td>
<td width="50%">

**🧮 Mathematically Correct**

Tax is calculated from gross salary and kept strictly isolated from manual deductions. No path exists where tax can be counted twice. 25 Jest unit tests verify every bracket, edge case, and decimal scenario.

</td>
</tr>
<tr>
<td width="50%">

**🛡️ Typed End-to-End**

`PayrollInput → PayrollResult` interfaces enforce a single authoritative contract from the database record through the calculator, API response, and dashboard UI. TypeScript catches contract drift at compile time.

</td>
<td width="50%">

**🐳 Docker-Native**

Multi-stage build produces a ~200 MB Alpine image. Non-root user. Built-in health check at `/api/health`. MongoDB included in Compose. Published automatically to GHCR on every push to `main`.

</td>
</tr>
</table>

---

## Quickest start — Docker

```bash
# Pull the latest image
docker pull ghcr.io/mostafa-said7/paytrack:latest

# Copy and configure secrets
cp .env.docker.example .env.docker
# → Edit .env.docker with your AUTH_SECRET and ADMIN credentials

# Start app + MongoDB
docker compose up
```

> **App:** http://localhost:3000  
> **Default login:** set in your `.env.docker`

---

## Local development

**Requirements:** Node.js 24+, pnpm, MongoDB

```bash
# 1 — Install
pnpm install

# 2 — Configure
cp .env.example .env
# → Fill in MONGO_URL, DB_NAME, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH

# 3 — Run
pnpm dev
```

### Generate secrets

```bash
# AUTH_SECRET — strong random 32-byte hex string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ADMIN_PASSWORD_HASH — scrypt hash of your chosen password
node -e "
  const {scryptSync, randomBytes} = require('crypto');
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync('YOUR_PASSWORD', salt, 64).toString('hex');
  console.log(salt + ':' + hash);
"
```

---

## Available scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server on port 3000 |
| `pnpm build` | Compile production bundle |
| `pnpm start` | Start production server |
| `pnpm test` | Run 25 Jest unit tests |
| `pnpm typecheck` | TypeScript type check (no emit) |

---

## Architecture

```
paytrack/
├── app/
│   ├── (workspace)/          # Protected route group
│   │   ├── dashboard/        # Payroll overview page
│   │   ├── login/            # Auth page
│   │   └── layout.tsx        # Workspace shell (nav + sign-out)
│   └── api/
│       ├── auth/             # login · logout
│       ├── employees/        # GET · POST
│       ├── payroll/          # GET · POST /calculate
│       ├── dashboard/stats/  # Typed DashboardStats DTO
│       ├── analytics/        # Department breakdown
│       └── health/           # Docker health check
│
├── features/
│   ├── employees/            # Employee schema + validation
│   ├── payroll/
│   │   └── domain/
│   │       ├── types.ts      # PayrollInput · PayrollResult
│   │       ├── calculator.ts # Authoritative payroll engine
│   │       └── calculator.test.ts  # 25 unit tests
│   └── dashboard/
│       └── types.ts          # DashboardStats DTO
│
├── lib/
│   ├── auth/                 # jwt · password · session · authorize
│   ├── db/                   # MongoDB client (singleton)
│   └── api/                  # Error helpers · response builders
│
└── config/
    ├── app.ts                # Tax rates · allowance fields · brand
    ├── environment.ts        # Validated env vars (Zod)
    └── schemas.ts            # Shared Zod schemas
```

---

## Payroll calculation model

```
grossSalary    =  baseSalary + Σ(housing + transport + medical)
taxAmount      =  grossSalary × rate        ← CALCULATED, never supplied
manualDeductions = insurance + loan         ← from employee record
totalDeductions  = taxAmount + manualDeductions
netSalary      =  max(0, grossSalary − totalDeductions)
```

> Tax is **always** computed from `grossSalary`. It is never read from employee deduction fields. This is enforced by both TypeScript types and a runtime guard that throws if `'tax'` ever appears in `deductionFields`.

---

## CI / CD pipeline

```
push to main
    │
    ├──▶ CI: test + typecheck + build
    │
    └──▶ Docker Publish: build image → push to GHCR as :latest

push tag v*
    │
    ├──▶ Release: test → docker build → GHCR :x.y.z + :latest
    │
    └──▶ GitHub Release created with changelog + pull command
```

---

## Security

This is a payroll application. Security is non-negotiable.

- **No plain-text credentials** ever stored or logged.
- **`HttpOnly` cookies** — XSS cannot steal session tokens.
- **`SameSite: Lax`** — CSRF mitigated by default.
- **`scrypt`** — memory-hard hashing, resistant to GPU attacks.
- **Security headers** on every response: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `HSTS`, `CSP`.
- **Non-root Docker user** — container runs as `nextjs:nodejs` (UID 1001).

**Found a vulnerability?** Open a private security advisory on GitHub — do not file a public issue.

---

## License

[MIT](LICENSE) © 2024 PayTrack
