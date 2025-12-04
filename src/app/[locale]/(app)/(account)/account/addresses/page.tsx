import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import type { Order } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

type Props = {
  params: {
    locale: string
  }
}

export default async function AddressesPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'AddressesPage' })

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(
      `/${locale}/login?warning=${encodeURIComponent(t('loginWarning'))}`,
    )
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 5,
      user,
      overrideAccess: false,
      pagination: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch (error) {
    // swallow as before
  }

  return (
    <div className="border p-8 rounded-lg bg-primary-foreground">
      <h1 className="text-3xl font-medium mb-8">{t('title')}</h1>

      <div className="mb-8">
        <AddressListing />
      </div>

      <CreateAddressModal />
    </div>
  )
}

export async function generateMetadata(
  { params: { locale } }: Props,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'AddressesPage' })

  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      url: `/${locale}/account/addresses`,
    }),
  }
}
