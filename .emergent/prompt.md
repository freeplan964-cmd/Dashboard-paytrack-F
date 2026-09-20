# PayTrack Dashboard — Complete Senior Architecture & Product Refactoring Plan

## Mission

Act as a senior Next.js/TypeScript software architect, application security engineer, backend engineer, database engineer, and product UI engineer.

Repository:
`Mostafa-SAID7/Dashboard-paytrack-F`

Goal: finish the repository as a clean, coherent, production-ready PayTrack payroll dashboard without over-engineering it.

Do not blindly follow an old plan. Inspect the current repository first and preserve good changes already present. Fix remaining architectural, functional, security, data, UI, testing, configuration, and cleanup gaps.

The target architecture is:

**Next.js App Router + TypeScript + feature-oriented modular architecture + explicit application/domain/infrastructure boundaries.**

Do NOT introduce a huge enterprise Clean Architecture framework, unnecessary DI containers, generic repositories, CQRS/MediatR, or abstractions that do not solve a real problem.

---

# 1. Current State — Already Improved

The repository has already moved away from the old monolithic/catch-all design.

Current good foundations include:

- Next.js App Router
- TypeScript
- explicit API route folders
- feature folders for employees/payroll
- centralized `config/app.ts`
- centralized environment validation
- centralized Zod schemas
- MongoDB client wrapper
- API error helper
- session boundary placeholder
- payroll domain calculator
- public brand assets
- root landing/home page
- workspace route group
- CI/release workflows
- Docker standalone build
- loading and manifest files

Do not destroy these improvements.

---

# 2. Remaining Critical Problems To Fix

## P0 — Authentication is still non-functional

`lib/auth/require-session.ts` currently rejects every request, including requests containing a Bearer token.

This is a deliberate placeholder, not real authentication.

Required:

1. Choose a real authentication strategy appropriate for the current application.
2. Do not invent fake authentication.
3. If authentication is intentionally deferred, isolate it behind a clear provider boundary and make the UI accurately communicate that the protected workspace is unavailable.
4. Never make private payroll APIs anonymously accessible.
5. Never log tokens or credentials.
6. Define authorization boundaries even if only one role currently exists.
7. Protect:
   - employees
   - payroll
   - dashboard stats
   - analytics
   - settings
8. Add a clear authenticated-session abstraction such as:
   - `lib/auth/session.ts`
   - `lib/auth/authorize.ts`
   - provider-specific adapter
9. Keep route handlers independent from the authentication provider.

Do not implement a fake `Bearer token === authenticated` shortcut.

---

# 3. P0 — Fix Payroll Calculation Correctness

Inspect:

`features/payroll/domain/calculator.ts`

There is a critical semantic issue:

- `taxAmount` is calculated separately.
- `deductionFields` includes `tax`.
- `manualDeductions` therefore can include `deductions.tax`.
- `totalDeductions = taxAmount + manualDeductions`.

This can double-count tax.

Define one authoritative payroll model.

Recommended model:

- base salary
- allowances
- gross salary
- statutory tax
- insurance
- loan/manual deductions
- total deductions
- net salary

Do not treat calculated tax and manually supplied tax as the same field unless the domain explicitly supports tax override.

Update schemas, calculator, form, API response, and UI consistently.

Add unit tests for:

- zero allowances
- allowances
- insurance
- loan
- low salary tax bracket
- high salary tax bracket
- zero deductions
- negative inputs
- decimal values
- net salary calculation
- tax cannot be double-counted

---

# 4. P0 — Dashboard API and UI Contract Mismatch

Current dashboard stats API returns fields such as:

- `totalEmployees`
- `totalPayroll`
- `avgSalary`
- `processedRecords`

The dashboard UI expects:

- `employeeCount`
- `totalPayroll`
- `averageSalary`
- `pendingCount`

This is a real contract bug.

Create a typed dashboard DTO and make the API and UI use exactly the same contract.

Do not solve this by adding random fallback expressions in the UI.

Example target:

```ts
type DashboardStats = {
  employeeCount: number
  totalPayroll: number
  averageSalary: number
  pendingCount: number
  processedCount: number
  period: string
}
