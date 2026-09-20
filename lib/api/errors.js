import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function jsonSuccess(data, init) {
  return NextResponse.json({ success: true, data }, init)
}

export function jsonError(error) {
  const apiError = error instanceof ApiError ? error : new ApiError(500, 'INTERNAL_ERROR', 'Something went wrong.')
  if (!(error instanceof ApiError)) console.error('[PayTrack API]', error)
  return NextResponse.json({ success: false, error: { code: apiError.code, message: apiError.message } }, { status: apiError.status })
}

export async function withApiError(handler, request) {
  try { return await handler(request) } catch (error) { return jsonError(error) }
}
