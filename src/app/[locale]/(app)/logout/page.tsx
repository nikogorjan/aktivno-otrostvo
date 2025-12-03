// app/[locale]/(auth)/logout/page.tsx
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LogoutPage } from './LogoutPage'

type Params = {
  locale: string
}

type Props = {
  params: Promise<Params>
}

export default async function Logout({ params }: Props) {
  // we don't strictly need locale here, but this keeps types happy
  await params

  return (
    <div className="container max-w-lg my-16">
      <Suspense fallback={null}>
        <LogoutPage />
      </Suspense>
    </div>
  )
}

// locale-aware metadata
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params

  return {
    description: 'Odjava uspešna.',
    title: 'Logout',
    openGraph: mergeOpenGraph({
      title: 'Logout',
      url: `/${locale}/logout`,
    }),
  }
}
