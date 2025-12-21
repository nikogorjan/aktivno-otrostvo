import configPromise from '@payload-config'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'

import { CardBig } from '@/components/CardBig'
import { CategoryFilter } from '@/components/CategoryFilter'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { TrendingPostItem } from '@/components/TrendingPostItem'
import PageClient from './page.client'

import { Flame, Sparkles, Tags } from 'lucide-react'

type Locale = 'sl' | 'en'
const LOCALES: Locale[] = ['sl', 'en']

type PageProps = {
  params: { locale: Locale } | Promise<{ locale: Locale }>
  searchParams?: { category?: string } | Promise<{ category?: string }>
}

export const revalidate = 600
export const dynamic = 'force-dynamic'

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
  /* Categories (sidebar)                                                */
  /* ------------------------------------------------------------------ */
  const categoriesRes = await payload.find({
    collection: 'postCategories',
    locale,
    limit: 200,
    sort: 'title',
    pagination: false,
  })

  /* ------------------------------------------------------------------ */
  /* Resolve category slug -> ID (reliable filtering)                     */
  /* ------------------------------------------------------------------ */
  let categoryId: string | undefined
  if (activeCategorySlug) {
    const catRes = await payload.find({
      collection: 'postCategories',
      locale,
      limit: 1,
      pagination: false,
      where: { slug: { equals: activeCategorySlug } },
    })
    categoryId = catRes.docs?.[0]?.id
  }

  /* ------------------------------------------------------------------ */
  /* Spotlight (featured)                                                */
  /* ------------------------------------------------------------------ */
  const spotlightRes = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 1,
    sort: 'featuredRank',
    where: {
      isFeatured: { equals: true },
      ...(categoryId ? { categories: { equals: categoryId } } : {}),
    },
  })
  const spotlightPost = spotlightRes.docs?.[0]

  /* ------------------------------------------------------------------ */
  /* Trending list                                                       */
  /* ------------------------------------------------------------------ */
  const trendingRes = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 4,
    sort: 'trendingRank',
    where: {
      isTrending: { equals: true },
      ...(categoryId ? { categories: { equals: categoryId } } : {}),
    },
  })

  /* ------------------------------------------------------------------ */
  /* Archive grid                                                        */
  /* ------------------------------------------------------------------ */
  const posts = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 12,
    sort: '-publishedAt',
    ...(categoryId ? { where: { categories: { equals: categoryId } } } : {}),
  })

  return (
    <div className="px-[5%] pb-16 pt-28 md:pb-24 md:pt-28 lg:pb-28 lg:pt-32 bg-scheme1Background">
      <div className="container px-0">
        <PageClient />

        {/* Title */}
        <div className="mb-10">
          <h1 className="font-bebas text-6xl md:text-8xl lg:text-9xl leading-none">All Articles</h1>
          <div className="mt-6 h-px w-full bg-border/40" />
        </div>

        {/* Layout: Sidebar | 1px separator | Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_8fr] gap-8">
          {/* Sidebar (fixed width like before) */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Tags className="h-4 w-4" />
              Categories
            </div>

            <div className="mt-4">
              {/* NOTE: for a sidebar list feel, keep it vertical */}
              <CategoryFilter
                locale={locale}
                categories={categoriesRes.docs}
                activeSlug={activeCategorySlug}
                className="flex flex-col items-start gap-2"
              />
            </div>
          </aside>

          {/* ✅ Vertical separator between sidebar and right content */}
          <div className="hidden lg:flex items-stretch justify-center">
            <div className="w-px bg-border/40 self-stretch hidden" />
          </div>

          {/* Right content */}
          <section>
            {/* Top: Spotlight | 1px separator | Trending (equal widths) */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1px_minmax(320px,460px)] gap-8 items-stretch">

              {/* Spotlight */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  Spotlight
                </div>

                <div className="mt-4 mb-4">
                  {spotlightPost ? (
                    <CardBig
                      locale={locale}
                      doc={spotlightPost}
                      relationTo="posts"
                      showCategories
                      className="mb-0"
                    />
                  ) : (
                    <div className="rounded-[12px] border border-border bg-card p-6 text-sm text-muted-foreground">
                      No featured post yet.
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ Vertical separator between spotlight and trending */}
              <div className="hidden lg:flex items-stretch justify-center">
                <div className="w-px bg-border/40 self-stretch" />
              </div>

              {/* Trending */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Flame className="h-4 w-4" />
                  Trending
                </div>

                <div className="mt-4 rounded-[12px] p-4">
                  <div className="flex flex-col gap-4">
                    {trendingRes.docs.length > 0 ? (
                      trendingRes.docs.map((doc) => (
                        <TrendingPostItem key={doc.id} locale={locale} doc={doc} />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No trending posts yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal separator between top and archive */}
            <div className="mt-10 mb-10 h-px w-full bg-border/40" />

            {/* Archive header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <PageRange
                collection="posts"
                currentPage={posts.page}
                limit={12}
                totalDocs={posts.totalDocs}
              />
            </div>

            {/* Archive grid (2 columns on large) */}
            <div className="mt-8">
              <CollectionArchive locale={locale} posts={posts.docs} columns={2} />
            </div>

            {/* Pagination */}
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
          </section>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return { title: 'All Articles' }
}
