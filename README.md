<div align="center">
  <img src="https://img.icons8.com/color/96/000000/receive-cash.png" alt="PayTrack Logo" width="80" height="80">
  <h1 align="center">PayTrack Dashboard</h1>
  <p align="center">
    <strong>Modern, clear, and secure payroll management.</strong>
  </p>
  <p align="center">
    <a href="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions/workflows/ci.yml">
      <img src="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions/workflows/ci.yml/badge.svg" alt="CI" />
    </a>
    <a href="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions/workflows/docker-publish.yml">
      <img src="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions/workflows/docker-publish.yml/badge.svg" alt="Docker Publish" />
    </a>
    <a href="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/pkgs/container/paytrack">
      <img src="https://img.shields.io/badge/ghcr.io-paytrack-blue?logo=docker" alt="GHCR Package" />
    </a>
    <a href="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/releases">
      <img src="https://img.shields.io/github/v/release/Mostafa-SAID7/Dashboard-paytrack-F" alt="Latest Release" />
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
    </a>
  </p>
</div>

<hr />

## ✨ Key Focus Points

PayTrack is engineered for stability, clarity, and security without enterprise over-engineering.

* 🔒 **Secure by Default** — Zero-dependency JWT auth using `HttpOnly` cookies and `scrypt` password hashing.
* 🧮 **Bulletproof Calculations** — Strict separation between manual deductions and statutory tax. 25 Jest unit tests.
* 🛡️ **End-to-End Type Safety** — Typed domain models ensure API contracts precisely match the UI.
* ⚡ **Next.js App Router** — Feature-module architecture (`/features/payroll`, `/features/employees`).
* 🎨 **Clean & Responsive UI** — Tailwind CSS + Shadcn/UI + Radix primitives. Accessible across all devices.
* 🐳 **Docker-Ready** — Multi-stage build, non-root user, health check, published to GHCR automatically.

---

## 🐳 Docker (Quickest Start)

```bash
# 1. Pull the image from GitHub Container Registry
docker pull ghcr.io/mostafa-said7/paytrack:latest

# 2. Copy and fill in your secrets
cp .env.docker.example .env.docker

# 3. Start the full stack (app + MongoDB)
docker compose up
```

> The app will be available at **http://localhost:3000**

---

## 🚀 Local Development

### Prerequisites
* **Node.js** 24+
* **pnpm** (installed via `corepack enable`)
* **MongoDB** (local or hosted URI)

### Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env

# Start the dev server
pnpm dev
```

*Visit [http://localhost:3000](http://localhost:3000)*

---

## 🧪 Testing & Validation

```bash
# Run unit tests (Jest — 25 tests)
pnpm test

# TypeScript typechecker
pnpm typecheck
```

---

## 🏗️ Architecture

```
app/            Next.js App Router (pages + API routes)
features/       Domain logic  (payroll calculator, employee models)
lib/            Infrastructure (auth tokens, DB client, API errors)
components/     UI primitives (Shadcn/UI)
config/         Centralized env validation + app configuration
```

---

## 📄 License

[MIT](LICENSE) © PayTrack
