import { getDatabase } from '@/lib/db/client'
import { payrollQuerySchema } from '@/features/payroll/schemas'
import { jsonError, jsonSuccess } from '@/lib/api/errors'
import { requireSession } from '@/lib/auth/require-session'

export const dynamic = 'force-dynamic'
const MAX_RESULTS = 1000

export async function GET(request: Request) {
  try {
    requireSession()
    const query = payrollQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams)
    )
    const filter = query.period ? { period: query.period } : {}
    const db = await getDatabase()
    const records = await db
      .collection('payroll_records')
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(MAX_RESULTS)
      .toArray()
    return jsonSuccess(records.map(({ _id, ...record }) => record))
  } catch (error) {
    return jsonError(error)
  }
}
