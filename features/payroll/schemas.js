import { z } from 'zod'
export const periodSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Period must use YYYY-MM format.')
export const payrollQuerySchema = z.object({ period: periodSchema.optional() })
export const calculatePayrollSchema = z.object({ employeeId: z.string().uuid(), period: periodSchema })
