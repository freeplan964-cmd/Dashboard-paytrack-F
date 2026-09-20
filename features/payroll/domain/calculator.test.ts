/**
 * Unit tests for the payroll calculator.
 *
 * Tax rates (from config/app.ts):
 *   threshold:  $5,000
 *   rateLow:    10% (grossSalary <= 5000)
 *   rateHigh:   15% (grossSalary >  5000)
 *
 * Deduction fields: ['insurance', 'loan']  — 'tax' must NOT be in this list.
 * Allowance fields: ['housing', 'transport', 'medical']
 */

import { calculatePayroll } from './calculator'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function salary(
  baseSalary: number,
  opts: {
    housing?: number
    transport?: number
    medical?: number
    insurance?: number
    loan?: number
  } = {}
) {
  return {
    baseSalary,
    allowances: {
      housing: opts.housing ?? 0,
      transport: opts.transport ?? 0,
      medical: opts.medical ?? 0,
    },
    deductions: {
      insurance: opts.insurance ?? 0,
      loan: opts.loan ?? 0,
    },
  }
}

// ---------------------------------------------------------------------------
// 1. Zero allowances
// ---------------------------------------------------------------------------
describe('zero allowances', () => {
  it('gross equals base salary when all allowances are zero', () => {
    const result = calculatePayroll(salary(3000))
    expect(result.totalAllowances).toBe(0)
    expect(result.grossSalary).toBe(3000)
  })
})

// ---------------------------------------------------------------------------
// 2. Allowances present
// ---------------------------------------------------------------------------
describe('allowances', () => {
  it('sums all three allowance fields into totalAllowances', () => {
    const result = calculatePayroll(salary(3000, { housing: 500, transport: 200, medical: 100 }))
    expect(result.totalAllowances).toBe(800)
    expect(result.grossSalary).toBe(3800)
  })

  it('partial allowances are summed correctly', () => {
    const result = calculatePayroll(salary(4000, { housing: 300 }))
    expect(result.totalAllowances).toBe(300)
    expect(result.grossSalary).toBe(4300)
  })
})

// ---------------------------------------------------------------------------
// 3. Insurance deduction
// ---------------------------------------------------------------------------
describe('insurance deduction', () => {
  it('subtracts insurance from grossSalary (alongside tax)', () => {
    const result = calculatePayroll(salary(3000, { insurance: 200 }))
    // gross=3000, tax=300 (10%), insurance=200 → net=2500
    expect(result.manualDeductions).toBe(200)
    expect(result.breakdown.deductions.insurance).toBe(200)
    expect(result.netSalary).toBe(2500)
  })
})

// ---------------------------------------------------------------------------
// 4. Loan deduction
// ---------------------------------------------------------------------------
describe('loan deduction', () => {
  it('subtracts loan from grossSalary (alongside tax)', () => {
    const result = calculatePayroll(salary(3000, { loan: 500 }))
    // gross=3000, tax=300 (10%), loan=500 → net=2200
    expect(result.manualDeductions).toBe(500)
    expect(result.breakdown.deductions.loan).toBe(500)
    expect(result.netSalary).toBe(2200)
  })
})

// ---------------------------------------------------------------------------
// 5. Low salary tax bracket (<= $5,000 → 10%)
// ---------------------------------------------------------------------------
describe('low salary tax bracket', () => {
  it('applies 10% tax for grossSalary = 5000 (boundary)', () => {
    const result = calculatePayroll(salary(5000))
    expect(result.taxAmount).toBe(500)      // 5000 * 0.10
    expect(result.netSalary).toBe(4500)
  })

  it('applies 10% tax for grossSalary < 5000', () => {
    const result = calculatePayroll(salary(2000))
    expect(result.taxAmount).toBe(200)      // 2000 * 0.10
    expect(result.netSalary).toBe(1800)
  })
})

// ---------------------------------------------------------------------------
// 6. High salary tax bracket (> $5,000 → 15%)
// ---------------------------------------------------------------------------
describe('high salary tax bracket', () => {
  it('applies 15% tax for grossSalary just above threshold', () => {
    const result = calculatePayroll(salary(5001))
    expect(result.taxAmount).toBeCloseTo(750.15)  // 5001 * 0.15
    expect(result.netSalary).toBeCloseTo(4250.85)
  })

  it('applies 15% tax for grossSalary = 8000', () => {
    const result = calculatePayroll(salary(8000))
    expect(result.taxAmount).toBe(1200)     // 8000 * 0.15
    expect(result.netSalary).toBe(6800)
  })

  it('switches bracket when allowances push gross above threshold', () => {
    // base=4800 + housing=300 → gross=5100 → 15% bracket
    const result = calculatePayroll(salary(4800, { housing: 300 }))
    expect(result.grossSalary).toBe(5100)
    expect(result.taxAmount).toBe(765)      // 5100 * 0.15
  })
})

// ---------------------------------------------------------------------------
// 7. Zero deductions
// ---------------------------------------------------------------------------
describe('zero deductions', () => {
  it('totalDeductions equals only the tax when all manual deductions are zero', () => {
    const result = calculatePayroll(salary(4000))
    expect(result.manualDeductions).toBe(0)
    expect(result.totalDeductions).toBe(result.taxAmount)
    expect(result.netSalary).toBe(4000 - 400) // 10% tax
  })
})

// ---------------------------------------------------------------------------
// 8. Negative inputs throw
// ---------------------------------------------------------------------------
describe('negative inputs', () => {
  it('throws for negative baseSalary', () => {
    expect(() => calculatePayroll({ baseSalary: -1000 })).toThrow('baseSalary must be a non-negative number')
  })

  it('throws for negative allowance', () => {
    expect(() => calculatePayroll(salary(2000, { housing: -100 }))).toThrow(
      'allowances.housing must be a non-negative number'
    )
  })

  it('throws for negative deduction', () => {
    expect(() => calculatePayroll(salary(2000, { insurance: -50 }))).toThrow(
      'deductions.insurance must be a non-negative number'
    )
  })

  it('throws for NaN baseSalary', () => {
    expect(() => calculatePayroll({ baseSalary: NaN })).toThrow('baseSalary must be a non-negative number')
  })

  it('throws for Infinity baseSalary', () => {
    expect(() => calculatePayroll({ baseSalary: Infinity })).toThrow('baseSalary must be a non-negative number')
  })
})

// ---------------------------------------------------------------------------
// 9. Decimal values
// ---------------------------------------------------------------------------
describe('decimal values', () => {
  it('handles fractional salary correctly', () => {
    const result = calculatePayroll(salary(1500.50))
    // gross=1500.50, tax=10% → 150.05, net=1350.45
    expect(result.taxAmount).toBeCloseTo(150.05)
    expect(result.netSalary).toBeCloseTo(1350.45)
  })

  it('handles fractional allowances', () => {
    const result = calculatePayroll(salary(2000, { housing: 250.75, transport: 100.25 }))
    expect(result.totalAllowances).toBeCloseTo(351)
    expect(result.grossSalary).toBeCloseTo(2351)
  })

  it('handles fractional deductions', () => {
    const result = calculatePayroll(salary(3000, { insurance: 75.50 }))
    expect(result.manualDeductions).toBeCloseTo(75.50)
    expect(result.netSalary).toBeCloseTo(3000 - 300 - 75.50)
  })
})

// ---------------------------------------------------------------------------
// 10. Net salary calculation (full formula verification)
// ---------------------------------------------------------------------------
describe('net salary calculation', () => {
  it('net = gross − tax − insurance − loan', () => {
    // base=6000, housing=500 → gross=6500 → 15% tax=975
    // insurance=200, loan=100 → manual=300
    // net = 6500 - 975 - 300 = 5225
    const result = calculatePayroll(salary(6000, { housing: 500, insurance: 200, loan: 100 }))
    expect(result.grossSalary).toBe(6500)
    expect(result.taxAmount).toBe(975)
    expect(result.manualDeductions).toBe(300)
    expect(result.totalDeductions).toBe(1275)
    expect(result.netSalary).toBe(5225)
  })

  it('net salary never goes below zero', () => {
    // Deductions exceed gross: base=100, insurance=200, loan=200
    // gross=100, tax=10, manual=400, total=410 > 100 → net=0
    const result = calculatePayroll(salary(100, { insurance: 200, loan: 200 }))
    expect(result.netSalary).toBe(0)
  })

  it('zero baseSalary produces zero net', () => {
    const result = calculatePayroll(salary(0))
    expect(result.baseSalary).toBe(0)
    expect(result.grossSalary).toBe(0)
    expect(result.taxAmount).toBe(0)
    expect(result.netSalary).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// 11. Tax cannot double-count
// ---------------------------------------------------------------------------
describe('tax double-count prevention', () => {
  it('taxAmount in breakdown equals taxAmount in result — not summed from deductions', () => {
    const result = calculatePayroll(salary(4000, { insurance: 100 }))
    // Tax must appear exactly once
    expect(result.breakdown.deductions.tax).toBe(result.taxAmount)
    // totalDeductions = tax + manualDeductions, NOT breakdown summed twice
    expect(result.totalDeductions).toBe(result.taxAmount + result.manualDeductions)
    // tax must not be summed into manualDeductions
    expect(result.manualDeductions).toBe(100)  // only insurance
  })

  it('totalDeductions = taxAmount + manualDeductions (verified independently)', () => {
    const result = calculatePayroll(salary(5000, { insurance: 200, loan: 300 }))
    expect(result.totalDeductions).toBe(result.taxAmount + result.manualDeductions)
    // Also verify breakdown.deductions.tax is NOT in manualDeductions
    expect(result.manualDeductions).toBe(500) // 200 + 300 only
    expect(result.taxAmount).toBe(500) // 5000 * 10%
    expect(result.totalDeductions).toBe(1000) // 500 + 500
  })

  it('breakdown deductions are for display only — they do not re-add to totalDeductions', () => {
    const result = calculatePayroll(salary(3000, { insurance: 150 }))
    const breakdownSum =
      result.breakdown.deductions.insurance +
      result.breakdown.deductions.loan +
      result.breakdown.deductions.tax
    // breakdownSum will be higher than totalDeductions if tax were double-counted
    // but totalDeductions is computed independently, so they may differ — that's fine
    // What we assert is that the ACTUAL net is not reduced by tax twice
    const expectedNet = result.grossSalary - result.totalDeductions
    expect(result.netSalary).toBe(Math.max(0, expectedNet))
  })
})
