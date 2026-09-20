import { ApiError } from '@/lib/api/errors'
import type { AuthenticatedSession, UserRole } from '@/lib/auth/session'

/**
 * Asserts that the authenticated session has the required role.
 * Throws ApiError(403) if the role does not match.
 * Call after requireSession() when a specific role is needed.
 */
export function authorize(session: AuthenticatedSession, role: UserRole): void {
  if (session.role !== role) {
    throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to access this resource.')
  }
}