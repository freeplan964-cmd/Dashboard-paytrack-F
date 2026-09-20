import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function jsonSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init)
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: { code: error.code, message: error.message } },
      { status: error.status }
    )
  }

  if (error instanceof ZodError) {
    const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message } },
      { status: 400 }
    )
  }

  console.error('[PayTrack API]', error)
  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } },
    { status: 500 }
  )
}
