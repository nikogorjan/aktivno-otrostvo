import configPromise from '@payload-config'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'

import { CardBig } from '@/components/CardBig'
import { CategoryFilter } from '@/components/CategoryFilter'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import PageClient from './page.client'

type Locale = 'sl' | 'en'
const LOCALES: Locale[] = ['sl', 'en']

type PageProps = {
  params: { locale: Locale } | Promise<{ locale: Locale }>
  searchParams?: { category?: string } | Promise<{ category?: string }>
}

export const revalidate = 600
export const dynamic = 'force-dynamic' // ✅ IMPORTANT for query-string filtering

export async function generateStaticParams(): Promise<Array<{ locale: Locale }>> {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  const { locale } = resolvedParams
  const activeCategorySlug = resolvedSearchParams?.category

  const payload = await getPayload({ config: configPromise })

  /* ------------------------------------------------------------------ */
  /* 1) Fetch ALL categories for filter UI                               */
  /* ------------------------------------------------------------------ */
  const categoriesRes = await payload.find({
    collection: 'postCategories',
    locale,
    limit: 200,
    sort: 'title',
    pagination: false,
  })

  /* ------------------------------------------------------------------ */
  /* 2) Resolve category slug -> category ID (CRITICAL FIX)              */
  /* ------------------------------------------------------------------ */
  let categoryId: string | undefined

  if (activeCategorySlug) {
    const catRes = await payload.find({
      collection: 'postCategories',
      locale,
      limit: 1,
      pagination: false,
      where: {
        slug: { equals: activeCategorySlug },
      },
    })

    categoryId = catRes.docs?.[0]?.id
  }

  /* ------------------------------------------------------------------ */
  /* 3) Fetch posts (filtered by category ID if selected)                */
  /* ------------------------------------------------------------------ */
  const posts = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 12,
    sort: '-publishedAt',
    ...(categoryId
      ? {
          where: {
            categories: { equals: categoryId },
          },
        }
      : {}),
  })

  const [featuredPost] = posts.docs

  return (
    <div className="px-[5%] pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-20 lg:pt-20 bg-scheme1Background">
      <div className="container">
        <PageClient />

        {/* Header */}
        <div className="rb-12 mb-12 w-full max-w-2xl md:mb-18 lg:mb-20">
          <h1 className="font-bebas mb-5 text-4xl md:mb-6 md:text-5xl lg:text-6xl">
            Zadnje objave
          </h1>

          <p className="font-karla text-base md:text-lg text-muted-foreground max-w-2xl">
            Vsak dogodek nosi zgodbo o solidarnosti. Delimo trenutke, ideje in uspehe, ki kažejo,
            kako lahko majhna dejanja ustvarijo velik učinek.
          </p>
        </div>

        {/* Featured ONLY when no category filter */}
        {!activeCategorySlug && featuredPost && (
          <div className="flex flex-col justify-start">
            <CardBig
              locale={locale}
              className="h-full"
              doc={featuredPost}
              relationTo="posts"
              showCategories
            />
          </div>
        )}

        {/* Range + Filter + Grid */}
        <div className="mt-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <PageRange
              collection="posts"
              currentPage={posts.page}
              limit={12}
              totalDocs={posts.totalDocs}
            />

            <CategoryFilter
              locale={locale}
              categories={categoriesRes.docs}
              activeSlug={activeCategorySlug}
            />
          </div>

          <div className="mt-8">
            <CollectionArchive locale={locale} posts={posts.docs} />
          </div>
        </div>

        <div className="container">
          {posts.totalPages > 1 && posts.page && (
            <Pagination
              locale={locale}
              page={posts.page}
              totalPages={posts.totalPages}
              category={activeCategorySlug}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return { title: 'Dogodki Rotary Martjanci' }
}
