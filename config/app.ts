/**
 * Centralized application configuration
 * Single source of truth for app metadata, constants, and default values
 */

export const appConfig = {
  // App metadata
  metadata: {
    title: 'PayTrack | Payroll operations',
    description: 'A clear, modern workspace for employee payroll management.',
    applicationName: 'PayTrack',
    keywords: ['payroll management', 'employee payroll', 'payroll operations', 'team compensation'],
    authors: [{ name: 'PayTrack' }],
    creator: 'PayTrack',
    category: 'business',
    brand: {
      name: 'PayTrack',
      tagline: 'Payroll operations',
      description: 'Payroll made clear',
      details: 'Keep every pay cycle accurate and on time.',
    },
    icons: {
      icon: '/brand/logo-mark.svg',
    },
  },

  // Viewport configuration
  viewport: {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#2563eb',
    colorScheme: 'light dark',
  },

  // UI constants
  ui: {
    // Navigation items [Icon, label] - labels correspond to pages
    navItems: [
      { label: 'Overview', icon: 'LayoutDashboard' },
      { label: 'Employees', icon: 'Users' },
      { label: 'Payroll', icon: 'FileText' },
      { label: 'Analytics', icon: 'BarChart3' },
      { label: 'Settings', icon: 'Settings' },
    ],

    // Payroll periods in YYYY-MM format (most recent first)
    periods: ['2024-06', '2024-05', '2024-04'],

    // Default period when app loads
    defaultPeriod: '2024-06',

    // Theme configuration
    theme: {
      defaultColorScheme: 'light dark', // Allow system preference
      darkModeClass: 'dark',
    },
  },

  // Payroll field definitions
  payroll: {
    // Allowance categories
    allowanceFields: ['housing', 'transport', 'medical'],
    allowanceDefaults: {
      housing: 0,
      transport: 0,
      medical: 0,
    },

    // Deduction categories
    deductionFields: ['tax', 'insurance', 'loan'],
    deductionDefaults: {
      tax: 0,
      insurance: 0,
      loan: 0,
    },

    // Tax calculation thresholds
    taxRates: {
      thresholdHigh: 5000, // Salary threshold for higher tax rate
      rateLow: 0.10, // 10% tax for salaries <= threshold
      rateHigh: 0.15, // 15% tax for salaries > threshold
    },
  },

  // Form defaults
  forms: {
    employeeDefaults: {
      name: '',
      email: '',
      position: '',
      department: '',
      baseSalary: '',
      allowances: {
        housing: '',
        transport: '',
        medical: '',
      },
      deductions: {
        tax: '',
        insurance: '',
        loan: '',
      },
    },
  },

  // Number formatting
  formatting: {
    currency: {
      locale: undefined, // Use browser locale
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    },
  },

  // Status constants
  status: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ON_LEAVE: 'on_leave',
  },

  // Validation constraints (must match Zod schemas)
  validation: {
    name: { minLength: 2, maxLength: 120 },
    email: { minLength: 5, maxLength: 255 },
    position: { minLength: 2, maxLength: 120 },
    department: { minLength: 2, maxLength: 80 },
    baseSalary: { minimum: 0 },
  },
}

// Helper function to get nav items with icons
export function getNavItems(iconMap) {
  return appConfig.ui.navItems.map(({ label, icon }) => [
    iconMap[icon],
    label,
  ])
}

// Helper function to format currency
export function formatCurrency(value) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat(
    appConfig.formatting.currency.locale,
    appConfig.formatting.currency
  ).format(amount)
}

// Helper function to get empty employee form
export function getEmptyEmployeeForm() {
  return JSON.parse(JSON.stringify(appConfig.forms.employeeDefaults))
}

// Helper function to get default period
export function getDefaultPeriod() {
  return appConfig.ui.defaultPeriod
}

// Helper function to get all payroll periods
export function getPayrollPeriods() {
  return [...appConfig.ui.periods]
}
