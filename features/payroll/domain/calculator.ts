import { appConfig } from '@/config/app'
import type { PayrollInput, PayrollResult } from './types'

/**
 * Calculates the payroll result for an employee.
 *
 * Calculation model:
 *   grossSalary    = baseSalary + totalAllowances
 *   taxAmount      = grossSalary × taxRate   (statutory, calculated — NEVER from deductionFields)
 *   manualDeductions = insurance + loan      (from deductionFields — MUST NOT contain 'tax')
 *   totalDeductions = taxAmount + manualDeductions
 *   netSalary      = max(0, grossSalary − totalDeductions)
 *
 * Tax is authoritative and isolated: it is computed from grossSalary and never sourced
 * from employee.deductions. This prevents any path where tax could be counted twice.
 */
export function calculatePayroll(employee: PayrollInput): PayrollResult {
  const allowances = employee.allowances ?? {}
  const deductions = employee.deductions ?? {}

  /**
   * Coerces a raw value to a non-negative finite number.
   * Throws a descriptive error for invalid inputs.
   */
  const toAmount = (value: unknown, field: string): number => {
    const result = Number(value ?? 0)
    if (!Number.isFinite(result) || result < 0) {
      throw new Error(`${field} must be a non-negative number (received: ${value}).`)
    }
    return result
  }

  // 1. Base salary
  const baseSalary = toAmount(employee.baseSalary, 'baseSalary')

  // 2. Allowances — summed from config-defined allowanceFields
  const allowanceBreakdown: Record<string, number> = {}
  for (const key of appConfig.payroll.allowanceFields) {
    allowanceBreakdown[key] = toAmount(allowances[key], `allowances.${key}`)
  }
  const totalAllowances = Object.values(allowanceBreakdown).reduce((a, b) => a + b, 0)

  // 3. Gross salary
  const grossSalary = baseSalary + totalAllowances

  // 4. Statutory tax — calculated from grossSalary; never sourced from employee.deductions.
  //    deductionFields in config MUST NOT contain 'tax'. This check is a safety guard.
  if (appConfig.payroll.deductionFields.includes('tax')) {
    throw new Error(
      "Configuration error: 'tax' must not appear in payroll.deductionFields. " +
        'Tax is always calculated from grossSalary to prevent double-counting.'
    )
  }
  const { thresholdHigh, rateLow, rateHigh } = appConfig.payroll.taxRates
  const taxAmount = grossSalary * (grossSalary > thresholdHigh ? rateHigh : rateLow)

  // 5. Manual deductions — summed from config-defined deductionFields (excludes tax)
  const deductionBreakdown: Record<string, number> = {}
  for (const key of appConfig.payroll.deductionFields) {
    deductionBreakdown[key] = toAmount(deductions[key], `deductions.${key}`)
  }
  const manualDeductions = Object.values(deductionBreakdown).reduce((a, b) => a + b, 0)

  // 6. Totals
  const totalDeductions = taxAmount + manualDeductions
  const netSalary = Math.max(0, grossSalary - totalDeductions)

  return {
    baseSalary,
    totalAllowances,
    grossSalary,
    taxAmount,
    manualDeductions,
    totalDeductions,
    netSalary,
    breakdown: {
      allowances: allowanceBreakdown,
      deductions: {
        insurance: deductionBreakdown['insurance'] ?? 0,
        loan: deductionBreakdown['loan'] ?? 0,
        // tax is listed here for transparency in the stored record.
        // It is NOT sourced from deductionBreakdown — it was calculated above.
        tax: taxAmount,
      },
    },
  }
}
