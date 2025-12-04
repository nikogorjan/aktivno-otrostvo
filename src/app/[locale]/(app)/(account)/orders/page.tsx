import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { OrderItem } from '@/components/OrderItem'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Orders({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'OrdersPage' })

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
      limit: 0,
      pagination: false,
      user,
      overrideAccess: false,
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
    <div className="border p-8 rounded-lg bg-primary-foreground w-full">
      <h1 className="text-3xl font-medium mb-8">{t('title')}</h1>

      {(!orders || !Array.isArray(orders) || orders.length === 0) && (
        <p>{t('noOrders')}</p>
      )}

      {orders && orders.length > 0 && (
        <ul className="flex flex-col gap-6">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderItem order={order} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'OrdersPage' })

  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      url: '/orders',
    }),
  }
}
