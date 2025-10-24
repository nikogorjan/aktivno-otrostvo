// app/layout.tsx (or wherever your RootLayout is)
import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GeistMono } from 'geist/font/mono' // keep if you still want this mono
import { Figtree as FigtreeGoogle } from 'next/font/google'
import { Suspense, type ReactNode } from 'react'
import './globals.css'

// Bind Figtree to the SAME CSS var you already use everywhere
const Figtree = FigtreeGoogle({
  subsets: ['latin'],
  display: 'swap',
  // keep the existing var name so no other changes are needed
  variable: '--font-geist-sans',
  // optional: pick weights you need
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[Figtree.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <Suspense fallback={null}>
            <AdminBar />
            <LivePreviewListener />
            <Header />
            <main>{children}</main>
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
