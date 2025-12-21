import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RichText } from '@/components/RichText'
import PageClient from './page.client'

import { PostHero } from '@/heros/PostHero'
import type { Locale, LocalePageProps } from '@/types/locale'
import { generateMeta } from '@/utilities/generateMeta'

const LOCALES: Locale[] = ['sl', 'en']

/**
 * IMPORTANT:
 * Next expects generateStaticParams signature compatible with params being strings.
 * Also for routes with [locale] + [slug], you should return BOTH locale+slug pairs.
 */
export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const payload = await getPayload({ config: configPromise })

  const params: Array<{ locale: string; slug: string }> = []

  for (const locale of LOCALES) {
    const res = await payload.find({
      collection: 'posts',
      locale,
      draft: false,
      limit: 1000,
      pagination: false,
      select: { slug: true },
    })

    for (const doc of res.docs) {
      if (doc.slug) params.push({ locale, slug: doc.slug })
    }
  }

  return params
}

type Args = LocalePageProps<{ slug: string }>

export default async function Post({ params }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale, slug } = await params

  const post = await queryPostBySlug({ slug, locale })
  if (!post) return notFound()

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8 px-[5%]">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              locale={locale}
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter(
                (p): p is Exclude<typeof p, string> => typeof p === 'object' && p !== null,
              )}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await queryPostBySlug({ slug, locale })
  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug, locale }: { slug: string; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    locale,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
