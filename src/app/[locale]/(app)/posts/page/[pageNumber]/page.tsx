import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'

import { CategoryFilter } from '@/components/CategoryFilter'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import PageClient from './page.client'

type Locale = 'sl' | 'en'
const LOCALES: Locale[] = ['sl', 'en']

export const revalidate = 600

type Args = {
  params: { locale: Locale; pageNumber: string }
  searchParams?: { category?: string }
}

export default async function Page({ params, searchParams }: Args) {
  const { locale, pageNumber } = params
  const activeCategory = searchParams?.category
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  // All categories (for filter UI)
  const categoriesRes = await payload.find({
    collection: 'postCategories',
    locale,
    limit: 200,
    sort: 'title',
    pagination: false,
  })

  const posts = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 12,
    sort: '-publishedAt',
    page: sanitizedPageNumber,
    overrideAccess: false,
    ...(activeCategory
      ? {
          where: {
            categories: {
              slug: { equals: activeCategory },
            },
          },
        }
      : {}),
  })

  // If user requests a page number beyond results, 404
  if (posts.totalPages && sanitizedPageNumber > posts.totalPages) notFound()

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

        {/* Range + Filter + Grid (together, near cards) */}
        <div className="mt-2">
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
              activeSlug={activeCategory}
            />
          </div>

          <div className="mt-8">
            <CollectionArchive locale={locale} posts={posts.docs} />
          </div>
        </div>

        <div className="container">
          {posts.page && posts.totalPages > 1 && (
            <Pagination
              locale={locale}
              page={posts.page}
              totalPages={posts.totalPages}
              category={activeCategory}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { pageNumber } = params
  return { title: `Posts – Page ${pageNumber}` }
}

// NOTE: With filtering via query-string (?category=...), we do NOT pre-generate params for every category.
// We only pre-generate normal pages for each locale.
export async function generateStaticParams(): Promise<Array<{ locale: Locale; pageNumber: string }>> {
  const payload = await getPayload({ config: configPromise })

  const allParams: Array<{ locale: Locale; pageNumber: string }> = []

  for (const locale of LOCALES) {
    const { totalDocs } = await payload.count({
      collection: 'posts',
      locale,
      overrideAccess: false,
    })

    const totalPages = Math.max(1, Math.ceil(totalDocs / 12))

    for (let i = 2; i <= totalPages; i++) {
      // start from page 2 because page 1 is /posts
      allParams.push({ locale, pageNumber: String(i) })
    }
  }

  return allParams
}
