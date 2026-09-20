import { cookies } from 'next/headers'
import { jsonSuccess } from '@/lib/api/errors'
import { SESSION_COOKIE } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export async function POST() {
  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return jsonSuccess({ signedOut: true })
}
