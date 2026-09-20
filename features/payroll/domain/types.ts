/**
 * Payroll domain types.
 * These are the authoritative input/output contracts for the payroll calculator.
 */

/** Fields the calculator reads from an employee record. */
export interface PayrollInput {
  baseSalary: number
  allowances?: {
    housing?: number
    transport?: number
    medical?: number
    [key: string]: number | undefined
  }
  /**
   * Manual deductions — must NOT include tax.
   * Tax is always calculated from gross salary; it is never supplied here.
   */
  deductions?: {
    insurance?: number
    loan?: number
    [key: string]: number | undefined
  }
}

/** The complete result returned by calculatePayroll(). */
export interface PayrollResult {
  baseSalary: number
  totalAllowances: number
  grossSalary: number
  /** Statutory tax calculated from grossSalary. Never supplied externally. */
  taxAmount: number
  /** Sum of manual deductions only (insurance + loan). Does NOT include tax. */
  manualDeductions: number
  /** taxAmount + manualDeductions */
  totalDeductions: number
  /** grossSalary − totalDeductions, floored at 0. */
  netSalary: number
  breakdown: {
    allowances: Record<string, number>
    deductions: {
      insurance: number
      loan: number
      /** Statutory tax — listed here for transparency, NOT re-summed from deductionFields. */
      tax: number
    }
  }
}
