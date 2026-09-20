/**
 * requireSession — enforces that a valid authenticated session exists.
 * Call this at the top of any protected API route handler.
 * Throws ApiError(401) if no session is present.
 */

import { ApiError } from '@/lib/api/errors'
import { getSession } from '@/lib/auth/session'
import type { AuthenticatedSession } from '@/lib/auth/session'

export function requireSession(): AuthenticatedSession {
  const session = getSession()

  if (!session) {
    throw new ApiError(401, 'AUTH_REQUIRED', 'An authenticated session is required.')
  }

  return session
}
