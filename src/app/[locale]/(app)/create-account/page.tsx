import type { Metadata } from 'next'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { RenderParams } from '@/components/RenderParams'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
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

export default async function CreateAccount({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'CreateAccountPage' })

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
    <div className="container py-16">
      <h1 className="text-xl mb-4">{t('title')}</h1>
      <Suspense fallback={<div />}>
        <RenderParams />
        <CreateAccountForm />
      </Suspense>
    </div>
  )
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'CreateAccountPage' })

  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      url: `/${locale}/create-account`,
    }),
  }
}
