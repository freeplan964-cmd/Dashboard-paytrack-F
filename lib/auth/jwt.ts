/**
 * Minimal stateless JWT implementation using Node's built-in `crypto` module.
 * Algorithm: HMAC-SHA256 (HS256). Zero external dependencies.
 *
 * Token layout: base64url(header).base64url(payload).base64url(signature)
 */

import { createHmac, timingSafeEqual } from 'crypto'
import { getEnvironment } from '@/config/environment'

const ALG = 'HS256'
const TOKEN_TTL_SECONDS = 60 * 60 * 8 // 8 hours

function base64urlEncode(data: string): string {
  return Buffer.from(data)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function base64urlDecode(data: string): string {
  const padded = data + '='.repeat((4 - (data.length % 4)) % 4)
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
}

function hmacSign(secret: string, data: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url')
}

export interface JwtPayload {
  sub: string   // userId
  role: string
  iat: number   // issued-at (unix seconds)
  exp: number   // expiry (unix seconds)
}

export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const { AUTH_SECRET } = getEnvironment()
  const now = Math.floor(Date.now() / 1000)
  const fullPayload: JwtPayload = { ...payload, iat: now, exp: now + TOKEN_TTL_SECONDS }

  const header = base64urlEncode(JSON.stringify({ alg: ALG, typ: 'JWT' }))
  const body = base64urlEncode(JSON.stringify(fullPayload))
  const signature = hmacSign(AUTH_SECRET, `${header}.${body}`)

  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const { AUTH_SECRET } = getEnvironment()
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, body, signature] = parts
    const expectedSig = hmacSign(AUTH_SECRET, `${header}.${body}`)

    // Timing-safe comparison to prevent timing attacks
    const sigBuf = Buffer.from(signature, 'base64url')
    const expBuf = Buffer.from(expectedSig, 'base64url')
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null

    const payload: JwtPayload = JSON.parse(base64urlDecode(body))
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) return null

    return payload
  } catch {
    return null
  }
}
