# syntax=docker/dockerfile:1.7

# ────────────────────────────────────────────────────────────────────────────
# Stage 1 — base: OS + pnpm
# ────────────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS base

# OCI labels — required so GitHub auto-links this package to the repository
LABEL org.opencontainers.image.title="PayTrack"
LABEL org.opencontainers.image.description="Modern payroll management dashboard"
LABEL org.opencontainers.image.url="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F"
LABEL org.opencontainers.image.source="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F"
LABEL org.opencontainers.image.licenses="MIT"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
WORKDIR /app

# ────────────────────────────────────────────────────────────────────────────
# Stage 2 — deps: install all deps (cached layer)
# ────────────────────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ────────────────────────────────────────────────────────────────────────────
# Stage 3 — builder: compile Next.js standalone output
# ────────────────────────────────────────────────────────────────────────────
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time placeholder secrets allow env schema validation to pass.
# Real secrets are NEVER baked into the image — they are injected at runtime.
RUN MONGODB_URI="mongodb://placeholder:27017/paytrack" \
    AUTH_SECRET="build-time-placeholder-min-32-chars-long-x" \
    ADMIN_EMAIL="placeholder@example.com" \
    ADMIN_PASSWORD_HASH="placeholder" \
    pnpm run build

# ────────────────────────────────────────────────────────────────────────────
# Stage 4 — runner: lean production image (~200 MB)
# ────────────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS runner

# Repeat OCI labels on the final stage so they appear on the published image
LABEL org.opencontainers.image.title="PayTrack"
LABEL org.opencontainers.image.description="Modern payroll management dashboard"
LABEL org.opencontainers.image.url="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F"
LABEL org.opencontainers.image.source="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F"
LABEL org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Only copy the standalone bundle — no source, no node_modules bloat
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
