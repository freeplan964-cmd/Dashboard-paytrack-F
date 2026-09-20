import './globals.css'

export const metadata = { title: 'PayTrack | Payroll operations', description: 'A clear, modern workspace for employee payroll management.', applicationName: 'PayTrack', icons: { icon: '/brand/logo-mark.svg' } }
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#2563eb', colorScheme: 'light dark' }

export default function RootLayout({ children }) { return <html lang="en"><body>{children}</body></html> }
