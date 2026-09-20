import { getDatabase } from '@/lib/db/client'

export const dynamic = 'force-dynamic'
import { payrollQuerySchema } from '@/features/payroll/schemas'
import { jsonError, jsonSuccess } from '@/lib/api/errors'
export async function GET(request) { try { const query = payrollQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)); const filter = query.period ? { period: query.period } : {}; const db = await getDatabase(); const records = await db.collection('payroll_records').find(filter).sort({ createdAt: -1 }).toArray(); return jsonSuccess(records.map(({ _id, ...record }) => record)) } catch (error) { return jsonError(error) } }
