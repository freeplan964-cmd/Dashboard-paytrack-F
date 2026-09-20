import { environmentSchema } from './schemas'

let _env: ReturnType<typeof environmentSchema.parse> | undefined

export function getEnvironment() {
  if (_env) return _env

  const result = environmentSchema.safeParse({
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    AUTH_SECRET: process.env.AUTH_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
  })

  if (!result.success) {
    const missing = result.error.errors.map((e) => e.path.join('.')).join(', ')
    throw new Error(`Missing or invalid environment variables: ${missing}`)
  }

  _env = result.data
  return _env
}

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'
