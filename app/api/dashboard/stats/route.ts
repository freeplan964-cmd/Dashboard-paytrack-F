import { getDatabase } from '@/lib/db/client'
import { jsonError, jsonSuccess } from '@/lib/api/errors'
import { requireSession } from '@/lib/auth/require-session'
import { periodSchema } from '@/config/schemas'
import { getDefaultPeriod } from '@/config/app'
import type { DashboardStats } from '@/features/dashboard/types'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
	try {
		requireSession()
		const requestedPeriod = new URL(request.url).searchParams.get('period')
		const period = periodSchema.parse(requestedPeriod || getDefaultPeriod())
		const db = await getDatabase()
		const [payrollSummary, employeeSummary] = await Promise.all([
			db.collection('payroll_records').aggregate([
				{ $match: { period } },
				{
					$group: {
						_id: null,
						totalPayroll: { $sum: '$netSalary' },
						processedCount: { $sum: 1 },
					},
				},
			]).next(),
			db.collection('employees').aggregate([
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
							{ $limit: 1 },
						],
						as: 'payroll',
					},
				},
				{
					$group: {
						_id: null,
						employeeCount: { $sum: 1 },
						pendingCount: {
							$sum: { $cond: [{ $eq: [{ $size: '$payroll' }, 0] }, 1, 0] },
						},
					},
				},
			]).next(),
		])
		const totalPayroll = payrollSummary?.totalPayroll || 0
		const processedCount = payrollSummary?.processedCount || 0
		const stats: DashboardStats = {
			employeeCount: employeeSummary?.employeeCount || 0,
			totalPayroll,
			averageSalary: processedCount ? totalPayroll / processedCount : 0,
			pendingCount: employeeSummary?.pendingCount || 0,
			processedCount,
			period,
		}
		return jsonSuccess(stats)
	} catch (error) {
		return jsonError(error)
	}
}
