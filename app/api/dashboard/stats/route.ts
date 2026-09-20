import { getDatabase } from '@/lib/db/client'
import { jsonError, jsonSuccess } from '@/lib/api/errors'
import { requireSession } from '@/lib/auth/require-session'

export const dynamic = 'force-dynamic'
const MAX_RESULTS = 5000

export async function GET(request: Request) { try { requireSession(request); const db = await getDatabase(); const [totalEmployees, records] = await Promise.all([db.collection('employees').countDocuments(), db.collection('payroll_records').find({}).limit(MAX_RESULTS).toArray()]); const totalPayroll = records.reduce((sum, record) => sum + (record.netSalary || 0), 0); return jsonSuccess({ totalEmployees, totalPayroll, avgSalary: records.length ? totalPayroll / records.length : 0, processedRecords: records.length }) } catch (error) { return jsonError(error) } }
