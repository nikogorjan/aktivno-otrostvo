import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import PageClient from './page.client'

import type { Locale, LocalePageProps } from '@/types/locale'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

export const revalidate = 600

type Args = LocalePageProps<{ pageNumber: string }>

export default async function Page({ params }: Args) {
  const { locale, pageNumber } = await params
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 12,
    sort: '-publishedAt',
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <div className="px-[5%] pb-16 pt-32 md:pb-24 md:pt-32 lg:pb-28 lg:pt-36 bg-scheme1Background">
      <div className="container">
        <PageClient />

        <div className="rb-12 mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4 font-karla">Dogodki</p>
            <h1 className="font-bebas mb-5 text-6xl md:mb-6 md:text-9xl lg:text-10xl">
              Srce dobrodelnosti
            </h1>
            <p className="font-karla md:text-md">
              Vsak dogodek nosi zgodbo o solidarnosti. Delimo trenutke, ideje in uspehe, ki kažejo,
              kako lahko majhna dejanja ustvarijo velik učinek.
            </p>
          </div>
        </div>

        <div className="container mb-8">
          <PageRange
            collection="posts"
            currentPage={posts.page}
            limit={12}
            totalDocs={posts.totalDocs}
          />
        </div>

        <CollectionArchive posts={posts.docs} />

        <div className="container">
          {posts.page && posts.totalPages > 1 && (
            <Pagination locale={locale} page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { pageNumber } = await params
  return {
    title: `Payload Website Template Posts Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const payload = await getPayload({ config: configPromise })

  const { totalDocs } = await payload.count({
    collection: 'posts',
    locale,
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 12)

  return Array.from({ length: totalPages }, (_, i) => ({
    pageNumber: String(i + 1),
  }))
}
