// src/app/[locale]/(auth)/login/page.tsx
import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'

import { LoginForm } from '@/components/forms/LoginForm'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { Suspense } from 'react'

type Params = {
  locale: string
}

type Props = {
  params: Promise<Params>
}

export default async function Login({ params }: Props) {
  const { locale } = await params

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(
      `/${locale}/account?warning=${encodeURIComponent('Si že prijavljen.')}`,
    )
  }

  return (
    <div className="container">
      <div className="max-w-xl mx-auto my-12">
        <RenderParams />

        <h1 className="mb-4 text-[1.8rem]">Prijava</h1>
        <p className="mb-8">
          {/* admin stays without locale, since it’s a separate app */}
          
        
        </p>
        <Suspense fallback={<div />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

// Locale-aware metadata
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params

  return {
    title: 'Login',
    description: 'Prijavi se ali ustvari račun.',
    openGraph: {
      title: 'Login',
      url: `/${locale}/login`,
    },
  }
}
