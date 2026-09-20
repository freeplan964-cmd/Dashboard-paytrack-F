/**
 * Session layer — reads the authenticated session from the HttpOnly cookie.
 * All API route handlers that need auth call requireSession() (from require-session.ts);
 * they never import this file directly.
 */

import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth/jwt'

export type UserRole = 'admin'

export interface AuthenticatedSession {
  userId: string
  role: UserRole
}

const SESSION_COOKIE = 'paytrack_session'

/**
 * Returns the current authenticated session, or null if no valid session exists.
 * Reads the signed JWT from the HttpOnly session cookie.
 * Never throws — invalid/missing tokens return null.
 */
export function getSession(): AuthenticatedSession | null {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    return {
      userId: payload.sub,
      role: payload.role as UserRole,
    }
  } catch {
    return null
  }
}

export { SESSION_COOKIE }