import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'

import { CategoryFilter } from '@/components/CategoryFilter'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'

type Locale = 'sl' | 'en'
const LOCALES: Locale[] = ['sl', 'en']

export const revalidate = 600

type PageProps = {
  params: Promise<{ locale: Locale; pageNumber: string }>
  searchParams?: Promise<{ category?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, pageNumber } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const activeCategorySlug = resolvedSearchParams?.category

  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 2) {
    // page 1 is /posts, this route should be /posts/page/2+
    notFound()
  }

  // All categories (for filter UI)
  const categoriesRes = await payload.find({
    collection: 'postCategories',
    locale,
    limit: 200,
    sort: 'title',
    pagination: false,
  })

  // Resolve category slug -> id (reliable relationship filtering)
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
    limit: 12,
    sort: '-publishedAt',
    page: sanitizedPageNumber,
    overrideAccess: false,
    ...(categoryId ? { where: { categories: { equals: categoryId } } } : {}),
  })

  // If user requests a page number beyond results, 404
  if (posts.totalPages && sanitizedPageNumber > posts.totalPages) notFound()

  return (
    <div className="px-[5%] pb-16 pt-32 md:pb-24 md:pt-32 lg:pb-28 lg:pt-36 bg-scheme1Background">
      <div className="container">

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
              activeSlug={activeCategorySlug}
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
              category={activeCategorySlug}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ pageNumber: string }> }): Promise<Metadata> {
  const { pageNumber } = await params
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

    // start from page 2 because page 1 is /posts
    for (let i = 2; i <= totalPages; i++) {
      allParams.push({ locale, pageNumber: String(i) })
    }
  }

  return allParams
}
