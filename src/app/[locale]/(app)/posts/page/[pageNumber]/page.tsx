// src/app/[locale]/(app)/posts/page/[pageNumber]/page.tsx
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'

import { CategoryFilter } from '@/components/CategoryFilter'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'

import { Tags } from 'lucide-react'

type Locale = 'sl' | 'en'
const LOCALES: Locale[] = ['sl', 'en']

export const revalidate = 600
export const dynamic = 'force-dynamic'

const PER_PAGE = 6

type PageProps = {
  params: Promise<{ locale: Locale; pageNumber: string }>
  searchParams?: Promise<{ category?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, pageNumber } = await params
  const t = await getTranslations({ locale, namespace: 'Blog' })

  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const activeCategorySlug = resolvedSearchParams?.category

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 2) notFound()

  const payload = await getPayload({ config: configPromise })

  const categoriesRes = await payload.find({
    collection: 'postCategories',
    locale,
    limit: 200,
    sort: 'title',
    pagination: false,
  })

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

  const posts = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: PER_PAGE,
    page: sanitizedPageNumber,
    sort: '-publishedAt',
    ...(categoryId ? { where: { categories: { equals: categoryId } } } : {}),
  })

  if (posts.totalPages && sanitizedPageNumber > posts.totalPages) notFound()

  return (
    <div className="px-[5%] pb-10 pt-10 md:pb-12 md:pt-12 lg:pb-16 lg:pt-16 bg-scheme1Background">
      <div className="container px-0">
        {/* Title */}
        <div className="mb-10">
          <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl leading-none">{t('title')}</h1>

          <p className="mt-2 max-w-[720px] text-base md:text-lg text-muted-foreground line-clamp-3">
            {t('description')}
          </p>

          <div className="mt-6 h-px w-full bg-border/40" />
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1px_8fr] gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Tags className="h-4 w-4" />
              {t('categoriesLabel')}
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

          {/* Separator */}
          <div className="hidden xl:flex items-stretch justify-center">
            <div className="w-px bg-border/40 self-stretch" />
          </div>

          {/* Content */}
          <section>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <PageRange
                collection="posts"
                currentPage={posts.page}
                limit={PER_PAGE}
                totalDocs={posts.totalDocs}
                locale={locale}
              />
            </div>

            <div className="mt-8">
              <CollectionArchive locale={locale} posts={posts.docs} columns={3} />
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
          </section>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; pageNumber: string }>
}): Promise<Metadata> {
  const { locale, pageNumber } = await params
  const t = await getTranslations({ locale, namespace: 'Pagination' })

  return { title: t('metaTitlePaged', { page: pageNumber }) }
}

export async function generateStaticParams(): Promise<Array<{ locale: Locale; pageNumber: string }>> {
  const payload = await getPayload({ config: configPromise })

  const allParams: Array<{ locale: Locale; pageNumber: string }> = []

  for (const locale of LOCALES) {
    const { totalDocs } = await payload.count({
      collection: 'posts',
      locale,
      overrideAccess: false,
    })

    const totalPages = Math.max(1, Math.ceil(totalDocs / PER_PAGE))

    for (let i = 2; i <= totalPages; i++) {
      allParams.push({ locale, pageNumber: String(i) })
    }
  }

  return allParams
}
