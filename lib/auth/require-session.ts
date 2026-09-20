import { ApiError } from '@/lib/api/errors'

/**
 * Authentication boundary for private API routes.
 *
 * The application does not have a session issuer yet, so requests are denied
 * rather than treated as anonymous. Replace this implementation with the
 * session verification used by the eventual login provider.
 */
export function requireSession(request: Request): void {
  const authorization = request.headers.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    throw new ApiError(401, 'AUTH_REQUIRED', 'Authentication is required.')
  }

  throw new ApiError(401, 'AUTH_REQUIRED', 'Authentication is required.')
}
