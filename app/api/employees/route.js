import { randomUUID } from 'crypto'
import { getDatabase } from '@/lib/db/client'
import { employeeSchema } from '@/features/employees/schemas'
import { ApiError, jsonError, jsonSuccess } from '@/lib/api/errors'

export async function GET() { try { const db = await getDatabase(); const employees = await db.collection('employees').find({}).sort({ createdAt: -1 }).toArray(); return jsonSuccess(employees.map(({ _id, ...employee }) => employee)) } catch (error) { return jsonError(error) } }
export async function POST(request) { try { const employee = employeeSchema.parse(await request.json()); const now = new Date(); const record = { id: randomUUID(), ...employee, status: 'active', createdAt: now, updatedAt: now }; const db = await getDatabase(); await db.collection('employees').insertOne(record); return jsonSuccess(record, { status: 201 }) } catch (error) { return jsonError(error) } }
