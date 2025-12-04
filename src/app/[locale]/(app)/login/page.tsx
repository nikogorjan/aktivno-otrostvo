import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { LoginForm } from '@/components/forms/LoginForm'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
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
  const t = await getTranslations({ locale, namespace: 'LoginPage' })

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(
      `/${locale}/account?warning=${encodeURIComponent(
        t('alreadyLoggedIn'),
      )}`,
    )
  }

  return (
    <div className="container">
      <div className="max-w-xl mx-auto my-12">
        <RenderParams />

        <h1 className="mb-4 text-[1.8rem]">{t('title')}</h1>
        <p className="mb-8">{t('subtitle')}</p>

        <Suspense fallback={<div />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'LoginPage' })

  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    openGraph: {
      title,
      url: `/${locale}/login`,
    },
  }
}
