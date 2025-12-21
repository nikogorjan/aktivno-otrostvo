// src/app/[locale]/(app)/posts/page.tsx
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
  params: Promise<{ locale: Locale }>
  searchParams?: Promise<{ category?: string }>
}

export const revalidate = 600
export const dynamic = 'force-dynamic'

export async function generateStaticParams(): Promise<Array<{ locale: Locale }>> {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  const activeCategorySlug = resolvedSearchParams?.category
  const shouldShowHero = !activeCategorySlug

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
  /* Spotlight + Trending (ONLY when no category filter)                  */
  /* ------------------------------------------------------------------ */
  const spotlightPost = shouldShowHero
    ? (
        await payload.find({
          collection: 'posts',
          locale,
          depth: 1,
          limit: 1,
          sort: 'featuredRank',
          where: { isFeatured: { equals: true } },
        })
      ).docs?.[0]
    : undefined

  const trendingDocs = shouldShowHero
    ? (
        await payload.find({
          collection: 'posts',
          locale,
          depth: 1,
          limit: 4,
          sort: 'trendingRank',
          where: { isTrending: { equals: true } },
        })
      ).docs
    : []

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
    <div className="px-[5%] pb-10 pt-10 md:pb-12 md:pt-12 lg:pb-16 lg:pt-16 bg-scheme1Background">
      <div className="container px-0">
        <PageClient />

        {/* Title */}
        <div className="mb-10">
          <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl leading-none">All Articles</h1>

          <p className="mt-2 max-w-[720px] text-base md:text-lg text-muted-foreground line-clamp-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>

          <div className="mt-6 h-px w-full bg-border/40" />
        </div>

        {/* Layout: Sidebar | 1px separator | Content */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1px_8fr] gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Tags className="h-4 w-4" />
              Categories
            </div>

            <div className="mt-4">
              <CategoryFilter
                locale={locale}
                categories={categoriesRes.docs}
                activeSlug={activeCategorySlug}
                className="flex flex-row items-start gap-2"
              />
            </div>
          </aside>

          {/* Separator between sidebar and content (only on xl because grid has 3 tracks there) */}
          <div className="hidden xl:flex items-stretch justify-center">
            <div className="w-px bg-border/40 self-stretch" />
          </div>

          {/* Content */}
          <section>
            {/* Hero (only when NOT filtering) */}
            {shouldShowHero && (
              <>
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

                  {/* Separator between spotlight and trending */}
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
                        {trendingDocs.length > 0 ? (
                          trendingDocs.map((doc) => (
                            <TrendingPostItem key={doc.id} locale={locale} doc={doc} />
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No trending posts yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horizontal separator between hero and archive */}
                <div className="mt-10 mb-10 h-px w-full bg-border/40" />
              </>
            )}

            {/* Archive header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <PageRange
                collection="posts"
                currentPage={posts.page}
                limit={12}
                totalDocs={posts.totalDocs}
              />
            </div>

            {/* Archive grid */}
            <div className="mt-8">
              <CollectionArchive locale={locale} posts={posts.docs} columns={3} />
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
