import { randomUUID } from 'crypto'
import { getDatabase } from '@/lib/db/client'
import { calculatePayrollSchema } from '@/features/payroll/schemas'
import { calculatePayroll } from '@/features/payroll/domain/calculator'
import { ApiError, jsonError, jsonSuccess } from '@/lib/api/errors'
import { requireSession } from '@/lib/auth/require-session'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    requireSession()
    const { employeeId, period } = calculatePayrollSchema.parse(await request.json())
    const db = await getDatabase()

    const employee = await db.collection('employees').findOne({ id: employeeId })
    if (!employee) throw new ApiError(404, 'EMPLOYEE_NOT_FOUND', 'Employee was not found.')

    const existing = await db.collection('payroll_records').findOne({ employeeId, period })
    if (existing) {
      throw new ApiError(409, 'PAYROLL_EXISTS', 'Payroll is already calculated for this period.')
    }

    const payrollResult = calculatePayroll({
      baseSalary: employee.baseSalary,
      allowances: employee.allowances,
      deductions: employee.deductions,
    })

    const record = {
      id: randomUUID(),
      employeeId,
      employeeName: employee.name,
      period,
      ...payrollResult,
      createdAt: new Date(),
      status: 'calculated',
    }

    await db.collection('payroll_records').insertOne(record)
    return jsonSuccess(record, { status: 201 })
  } catch (error) {
    return jsonError(error)
  }
}
