import type { Metadata } from 'next'

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

type Params = {
  locale: string
}

type Props = {
  params: Promise<Params>
}

export default async function ForgotPasswordPage() {
  return (
    <div className="container py-16">
      <Suspense fallback={<div />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  )
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'ForgotPasswordPage',
  })

  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      url: `/${locale}/recover-password`,
    }),
  }
}
