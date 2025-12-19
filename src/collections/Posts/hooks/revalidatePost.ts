import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Post } from '../../../payload-types'

const LOCALES = ['sl', 'en'] as const
const PAGINATION_PAGES_TO_REVALIDATE = 5

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  const revalidateAll = (slug: string) => {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/posts`)
    revalidatePath(`/${locale}/posts/${slug}`)

    for (let page = 1; page <= PAGINATION_PAGES_TO_REVALIDATE; page++) {
      revalidatePath(`/${locale}/posts/page/${page}`)
    }
  }

  revalidateTag('posts-sitemap')
}

  if (doc._status === 'published' && doc.slug) {
    payload.logger.info(`Revalidating published post: ${doc.slug}`)
    revalidateAll(doc.slug)
  }

  // If it was published before and changed slug/unpublished, also revalidate old
  if (previousDoc?._status === 'published' && previousDoc.slug) {
    // if slug changed OR unpublished
    if (doc._status !== 'published' || previousDoc.slug !== doc.slug) {
      payload.logger.info(`Revalidating previous post path: ${previousDoc.slug}`)
      revalidateAll(previousDoc.slug)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (context.disableRevalidate) return doc
  if (!doc?.slug) return doc

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/posts`)
    revalidatePath(`/${locale}/posts/${doc.slug}`)
  }

  revalidateTag('posts')
  revalidateTag('posts-sitemap')

  return doc
}
