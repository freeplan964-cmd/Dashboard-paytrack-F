# syntax=docker/dockerfile:1.7

# ────────────────────────────────────────────────────────────────
# Stage 1 — base: shared OS + pnpm setup
# ────────────────────────────────────────────────────────────────
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
WORKDIR /app

# ────────────────────────────────────────────────────────────────
# Stage 2 — deps: install production + dev deps (cached layer)
# ────────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ────────────────────────────────────────────────────────────────
# Stage 3 — builder: compile Next.js standalone bundle
# ────────────────────────────────────────────────────────────────
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
# Copy installed deps
COPY --from=deps /app/node_modules ./node_modules
# Copy source — .dockerignore prevents .env, .git, node_modules, etc.
COPY . .
# Build requires env schema validation; supply safe build-time placeholders.
# Real secrets are injected at runtime via env_file / Kubernetes secrets.
RUN MONGODB_URI="mongodb://placeholder:27017/paytrack" \
    AUTH_SECRET="build-time-placeholder-do-not-use-in-production" \
    ADMIN_EMAIL="placeholder@example.com" \
    ADMIN_PASSWORD_HASH="placeholder" \
    pnpm run build

# ────────────────────────────────────────────────────────────────
# Stage 4 — runner: minimal production image
# ────────────────────────────────────────────────────────────────
FROM node:24-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Only copy the standalone output — no source, no node_modules bloat
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000

# Health check — lets Docker / Compose know when the app is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
