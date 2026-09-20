import { appConfig } from '@/config/app'

export function calculatePayroll(employee) {
  const allowances = employee.allowances || {}
  const deductions = employee.deductions || {}

  // Calculate total allowances using config-defined fields
  const totalAllowances = appConfig.payroll.allowanceFields.reduce(
    (sum, key) => sum + Number(allowances[key] || 0),
    0
  )

  // Calculate gross salary
  const baseSalary = Number(employee.baseSalary || 0)
  const grossSalary = baseSalary + totalAllowances

  // Calculate tax using config-defined rates
  const { thresholdHigh, rateLow, rateHigh } = appConfig.payroll.taxRates
  const taxAmount = grossSalary * (grossSalary > thresholdHigh ? rateHigh : rateLow)

  // Calculate manual deductions using config-defined fields
  const manualDeductions = appConfig.payroll.deductionFields.reduce(
    (sum, key) => sum + Number(deductions[key] || 0),
    0
  )

  const totalDeductions = taxAmount + manualDeductions

  return {
    baseSalary,
    totalAllowances,
    grossSalary,
    taxAmount,
    totalDeductions,
    netSalary: grossSalary - totalDeductions,
    breakdown: {
      allowances,
      deductions: { ...deductions, tax: taxAmount },
    },
  }
}
