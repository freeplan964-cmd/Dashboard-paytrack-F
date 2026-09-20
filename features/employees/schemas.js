import { z } from 'zod'

const money = z.coerce.number().min(0).default(0)
const moneyFields = z.object({ housing: money, transport: money, medical: money })
const deductionFields = z.object({ tax: money, insurance: money, loan: money })

export const employeeSchema = z.object({
  name: z.string().trim().min(2).max(120), email: z.string().trim().email(), position: z.string().trim().min(2).max(120), department: z.string().trim().min(2).max(80), baseSalary: z.coerce.number().positive(), allowances: moneyFields.default({ housing: 0, transport: 0, medical: 0 }), deductions: deductionFields.default({ tax: 0, insurance: 0, loan: 0 }),
})
export const employeeIdSchema = z.string().uuid()
