import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { homeStaticData } from '@/endpoints/seed/home-static'
import { RenderHero } from '@/heros/RenderHero'
import type { Page } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'

type Locale = 'sl' | 'en'

type PageParams = {
  slug?: string
  locale: Locale
}

// 👇 IMPORTANT: `params` is a Promise here
type PageProps = {
  params: Promise<PageParams>
}

// Generate all { locale, slug } combinations for static pages
export async function generateStaticParams(): Promise<PageParams[]> {
  const payload = await getPayload({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const locales: Locale[] = ['sl', 'en']

  const params: PageParams[] =
    pages.docs
      ?.filter((doc: any) => {
        return doc.slug !== 'home'
      })
      .flatMap((doc: any) =>
        locales.map((locale) => {
          const rawSlug = doc.slug
          // Supports both non-localized and localized slug fields
          const slug = typeof rawSlug === 'string' ? rawSlug : (rawSlug?.[locale] ?? rawSlug?.sl)

          return { slug, locale }
        }),
      ) ?? []

  return params
}

export default async function Page({ params }: PageProps) {
  // 👇 await params
  const { slug = 'home', locale } = await params

  let page = await queryPageBySlug({
    slug,
    locale,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStaticData() as Page
  }

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <article>
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // 👇 await params here too
  const { slug = 'home', locale } = await params

  const page = await queryPageBySlug({
    slug,
    locale,
  })

  if (!page) {
    // Fallback metadata if page not found
    return {}
  }

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({ slug, locale }: { slug: string; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    locale, // 👈 This is what pulls the correct language from Payload
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return (result.docs?.[0] as Page | undefined) || null
}
