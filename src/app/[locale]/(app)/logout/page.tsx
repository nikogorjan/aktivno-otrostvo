import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { LogoutPage } from './LogoutPage'

type Params = {
  locale: string
}

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Logout({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="container max-w-lg my-16">
      <Suspense fallback={null}>
        <LogoutPage />
      </Suspense>
    </div>
  )
}

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'LogoutPage',
  })

  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      url: `/${locale}/logout`,
    }),
  }
}
