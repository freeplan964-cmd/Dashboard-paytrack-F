import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/health
 *
 * Lightweight health check used by Docker HEALTHCHECK, load balancers, and
 * uptime monitors. Returns 200 when the process is alive.
 *
 * Does NOT check the database — DB health is monitored separately via
 * Docker Compose's mongo service healthcheck.
 */
export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? 'unknown',
    },
    { status: 200 }
  )
}
