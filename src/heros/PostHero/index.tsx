import type { Post, PostCategory } from '@/payload-types'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatDateTime } from '@/utilities/formatDateTime'

type ResolvedCategory = Pick<PostCategory, 'id' | 'title'>
type Locale = 'sl' | 'en'

export const PostHero: React.FC<{ post: Post; locale: Locale }> = async ({ post, locale }) => {
  const t = await getTranslations({ locale, namespace: 'PostHero' })
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const categoryDocs: ResolvedCategory[] = Array.isArray(categories)
    ? categories
        .filter((c): c is PostCategory => typeof c === 'object' && c !== null)
        .map((c) => ({ id: c.id, title: c.title }))
    : []

  return (
    <section>
      <div className="container">
        <div className="mx-auto max-w-[48rem]">
          {/* Categories */}
          {categoryDocs.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {categoryDocs.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center rounded-[6px] border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80"
                >
                  {cat.title || t('untitledCategory')}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-5 text-3xl md:text-5xl lg:text-6xl leading-tight">{title}</h1>

          {/* Meta */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:gap-12 text-sm text-muted-foreground">
            {hasAuthors && (
              <div>
                <p className="uppercase text-xs text-muted-foreground/80">{t('authorLabel')}</p>
                <p className="text-foreground">{formatAuthors(populatedAuthors)}</p>
              </div>
            )}

            {publishedAt && (
              <div>
                <p className="uppercase text-xs text-muted-foreground/80">{t('publishedLabel')}</p>
                <time dateTime={publishedAt} className="text-foreground">
                  {formatDateTime({ date: publishedAt })}
                </time>
              </div>
            )}
          </div>

          {/* Image */}
          {heroImage && typeof heroImage !== 'string' && (
            <div className="relative overflow-hidden rounded-[10px] aspect-video bg-black/5">
              <Media fill priority resource={heroImage} imgClassName="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
