// next.config.js
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'
import redirects from './redirects.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const APP_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// 👇 POINT TO request.ts, not routing.ts
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...(() => {
        try {
          const u = new URL(APP_URL)
          return [{ protocol: u.protocol.replace(':', ''), hostname: u.hostname, pathname: '/**' }]
        } catch {
          return []
        }
      })(),
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'bloom42-media.s3.eu-central-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  redirects,
  outputFileTracingRoot: __dirname,
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return config
  },
}

// Wrap Payload first, then next-intl
export default withNextIntl(withPayload(nextConfig))
