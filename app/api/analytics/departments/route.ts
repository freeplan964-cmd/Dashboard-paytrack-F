import { getDatabase } from '@/lib/db/client'
import { jsonError, jsonSuccess } from '@/lib/api/errors'
import { requireSession } from '@/lib/auth/require-session'
import { periodSchema } from '@/config/schemas'
import { getDefaultPeriod } from '@/config/app'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    requireSession()
    const requestedPeriod = new URL(request.url).searchParams.get('period')
    const period = periodSchema.parse(requestedPeriod || getDefaultPeriod())
    const db = await getDatabase()
    const departments = await db.collection('employees').aggregate([
      {
        $lookup: {
          from: 'payroll_records',
          let: { employeeId: '$id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$employeeId', '$$employeeId'] },
                    { $eq: ['$period', period] },
                  ],
                },
              },
            },
            { $project: { _id: 0, netSalary: 1 } },
            { $limit: 1 },
          ],
          as: 'payroll',
        },
      },
      {
        $group: {
          _id: '$department',
          employeeCount: { $sum: 1 },
          totalSalary: { $sum: { $ifNull: [{ $arrayElemAt: ['$payroll.netSalary', 0] }, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          employeeCount: 1,
          totalSalary: 1,
          avgSalary: { $divide: ['$totalSalary', '$employeeCount'] },
        },
      },
      { $sort: { department: 1 } },
    ]).toArray()

    return jsonSuccess(departments)
  } catch (error) {
    return jsonError(error)
  }
}
