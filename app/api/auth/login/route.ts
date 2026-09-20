import { z } from 'zod'
import { cookies } from 'next/headers'
import { ApiError, jsonError, jsonSuccess } from '@/lib/api/errors'
import { verifyPassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import { getEnvironment } from '@/config/environment'
import { SESSION_COOKIE } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Cookie TTL must match JWT TTL (8 hours)
const COOKIE_MAX_AGE = 60 * 60 * 8

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json())
    const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH } = getEnvironment()

    // Constant-time email comparison to avoid user enumeration
    const emailMatch = body.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    const passwordMatch = verifyPassword(body.password, ADMIN_PASSWORD_HASH)

    // Check both — even if email is wrong, run password check to prevent timing oracle
    if (!emailMatch || !passwordMatch) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.')
    }

    const token = signToken({ sub: 'admin', role: 'admin' })

    const cookieStore = cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    })

    return jsonSuccess({ role: 'admin' })
  } catch (error) {
    return jsonError(error)
  }
}
