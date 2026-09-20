/**
 * Centralized Zod schemas for all data validation
 * Single source of truth for data validation rules
 */

import { z } from 'zod'

// Reusable field schemas
const moneyField = z.coerce.number().min(0).default(0)
const allowanceFields = z.object({
  housing: moneyField,
  transport: moneyField,
  medical: moneyField,
})
const deductionFields = z.object({
  insurance: moneyField,
  loan: moneyField,
})

// Employee schema - comprehensive validation
export const employeeSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  position: z.string().trim().min(2).max(120),
  department: z.string().trim().min(2).max(80),
  baseSalary: z.coerce.number().positive(),
  allowances: allowanceFields.default({ housing: 0, transport: 0, medical: 0 }),
  deductions: deductionFields.default({ insurance: 0, loan: 0 }),
})

// Employee with ID (for responses)
export const employeeWithIdSchema = employeeSchema.extend({
  id: z.string().uuid(),
  status: z.enum(['active', 'inactive', 'on_leave']).default('active'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// Employee ID validation
export const employeeIdSchema = z.string().uuid()

// Payroll period validation (YYYY-MM format)
export const periodSchema = z.string().regex(
  /^\d{4}-(0[1-9]|1[0-2])$/,
  'Period must use YYYY-MM format.'
)

// Payroll query schema
export const payrollQuerySchema = z.object({
  period: periodSchema.optional(),
})

// Calculate payroll schema
export const calculatePayrollSchema = z.object({
  employeeId: employeeIdSchema,
  period: periodSchema,
})

// Payroll record schema (DB structure)
export const payrollRecordSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  period: periodSchema,
  baseSalary: z.number().nonnegative(),
  totalAllowances: z.number().nonnegative(),
  grossSalary: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  manualDeductions: z.number().nonnegative(),
  totalDeductions: z.number().nonnegative(),
  netSalary: z.number().nonnegative(),
  breakdown: z.object({
    allowances: z.record(z.string(), z.number()),
    deductions: z.record(z.string(), z.number()),
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// Environment schema (shared with environment.ts)
export const environmentSchema = z.object({
  MONGO_URL: z.string().min(1),
  DB_NAME: z.string().min(1),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters.'),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z.string().min(1),
})

// Helper function to validate and parse employee data
export function validateEmployee(data) {
  return employeeSchema.parse(data)
}

// Helper function to validate period
export function validatePeriod(period) {
  return periodSchema.parse(period)
}

// Helper function to validate payroll query
export function validatePayrollQuery(query) {
  return payrollQuerySchema.parse(query)
}
