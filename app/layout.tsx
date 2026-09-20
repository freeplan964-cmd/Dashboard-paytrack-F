import './globals.css'
import { appConfig } from '@/config/app'

export const metadata = appConfig.metadata
export const viewport = appConfig.viewport

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
