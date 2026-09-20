export function calculatePayroll(employee) {
  const allowances = employee.allowances || {}
  const deductions = employee.deductions || {}
  const totalAllowances = ['housing', 'transport', 'medical'].reduce((sum, key) => sum + Number(allowances[key] || 0), 0)
  const grossSalary = Number(employee.baseSalary || 0) + totalAllowances
  const taxAmount = grossSalary * (grossSalary > 5000 ? 0.15 : 0.10)
  const manualDeductions = ['tax', 'insurance', 'loan'].reduce((sum, key) => sum + Number(deductions[key] || 0), 0)
  const totalDeductions = taxAmount + manualDeductions
  return { baseSalary: Number(employee.baseSalary || 0), totalAllowances, grossSalary, taxAmount, totalDeductions, netSalary: grossSalary - totalDeductions, breakdown: { allowances, deductions: { ...deductions, tax: taxAmount } } }
}
