import type { MetadataRoute } from 'next'
import { appConfig } from '@/config/app'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appConfig.metadata.applicationName,
    short_name: appConfig.metadata.applicationName,
    description: appConfig.metadata.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: appConfig.viewport.themeColor,
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/brand/logo-mark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  }
}
