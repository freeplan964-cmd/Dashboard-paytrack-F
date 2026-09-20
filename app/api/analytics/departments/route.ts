import { getDatabase } from '@/lib/db/client'
import { jsonError, jsonSuccess } from '@/lib/api/errors'
import { requireSession } from '@/lib/auth/require-session'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    requireSession()
    const period = new URL(request.url).searchParams.get('period')
    const db = await getDatabase()

    const [employees, records] = await Promise.all([
      db.collection('employees').find({}).toArray(),
      db.collection('payroll_records').find(period ? { period } : {}).sort({ createdAt: -1 }).toArray(),
    ])

    const grouped: Record<string, {
      department: string
      employeeCount: number
      totalSalary: number
      avgSalary: number
    }> = {}

    for (const employee of employees) {
      const group = (grouped[employee.department] ??= {
        department: employee.department,
        employeeCount: 0,
        totalSalary: 0,
        avgSalary: 0,
      })
      group.employeeCount++
      const payroll = records.find((record) => record.employeeId === employee.id)
      group.totalSalary += payroll?.netSalary || 0
    }

    return jsonSuccess(
      Object.values(grouped).map((group) => ({
        ...group,
        avgSalary: group.employeeCount ? group.totalSalary / group.employeeCount : 0,
      }))
    )
  } catch (error) {
    return jsonError(error)
  }
}
