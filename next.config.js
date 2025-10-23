import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'
import redirects from './redirects.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const APP_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // your public app origin
      ...(() => {
        try {
          const u = new URL(APP_URL)
          return [{ protocol: u.protocol.replace(':', ''), hostname: u.hostname, pathname: '/**' }]
        } catch {
          return []
        }
      })(),
      // localhost (dev)
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      // OPTIONAL: your LAN IP while developing
      // { protocol: 'http', hostname: '192.168.178.68', pathname: '/**' },

      // your S3 bucket (this is the important one)
      {
        protocol: 'https',
        hostname: 'bloom42-media.s3.eu-central-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  redirects,
  // this line is optional; include it if you want to silence the workspace-root warning
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

export default withPayload(nextConfig)
