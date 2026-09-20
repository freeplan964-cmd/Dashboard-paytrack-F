import { randomUUID } from 'crypto'
import { getDatabase } from '@/lib/db/client'
import { calculatePayrollSchema } from '@/features/payroll/schemas'
import { calculatePayroll } from '@/features/payroll/domain/calculator'
import { ApiError, jsonError, jsonSuccess } from '@/lib/api/errors'
export async function POST(request) { try { const { employeeId, period } = calculatePayrollSchema.parse(await request.json()); const db = await getDatabase(); const employee = await db.collection('employees').findOne({ id: employeeId }); if (!employee) throw new ApiError(404, 'EMPLOYEE_NOT_FOUND', 'Employee was not found.'); if (await db.collection('payroll_records').findOne({ employeeId, period })) throw new ApiError(409, 'PAYROLL_EXISTS', 'Payroll is already calculated for this period.'); const record = { id: randomUUID(), employeeId, employeeName: employee.name, period, ...calculatePayroll(employee), createdAt: new Date(), status: 'calculated' }; await db.collection('payroll_records').insertOne(record); return jsonSuccess(record, { status: 201 }) } catch (error) { return jsonError(error) } }
