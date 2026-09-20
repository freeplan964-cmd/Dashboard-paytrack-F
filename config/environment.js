import { environmentSchema } from './schemas'

export function getEnvironment() {
  const result = environmentSchema.safeParse({
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
  })

  if (!result.success) {
    throw new Error('MongoDB environment is not configured.')
  }

  return result.data
}

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'
