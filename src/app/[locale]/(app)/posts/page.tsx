import type { Metadata } from 'next/types'

import { CardBig } from '@/components/CardBig'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import PageClient from './page.client'

type Locale = 'sl' | 'en'

type PageProps = {
  params: Promise<{ locale: Locale }>
}

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 12,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      excerpt: true,
      publishedAt: true,
    },
  })

  const [featuredPost] = posts.docs

  return (
    <div className="px-[5%] pb-16 pt-32 md:pb-24 md:pt-32 lg:pb-28 lg:pt-36 bg-scheme1Background">
      <div className="container">
        <PageClient />

        {/* Header */}
        <div className="rb-12 mb-12 w-full max-w-2xl md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4 font-karla">Dogodki</p>

          <h1 className="font-bebas mb-5 text-6xl md:mb-6 md:text-9xl lg:text-10xl">
            Srce dobrodelnosti
          </h1>

          {/* ✅ Intro description under header (styled like your Values section) */}
          <p className="font-karla text-base md:text-lg text-muted-foreground max-w-2xl">
            Vsak dogodek nosi zgodbo o solidarnosti. Delimo trenutke, ideje in uspehe, ki kažejo,
            kako lahko majhna dejanja ustvarijo velik učinek.
          </p>
        </div>

        {/* Featured */}
        <div className="flex flex-col justify-start">
          <CardBig
            locale={locale}
            className="h-full"
            doc={featuredPost}
            relationTo="posts"
            showCategories
          />
        </div>

        <div className="container mb-8">
          <PageRange collection="posts" currentPage={posts.page} limit={12} totalDocs={posts.totalDocs} />
        </div>

        {/* Archive grid */}
        <CollectionArchive locale={locale} posts={posts.docs} />

        <div className="container">
          {posts.totalPages > 1 && posts.page && (
            <Pagination locale={locale} page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Dogodki Rotary Martjanci',
  }
}
