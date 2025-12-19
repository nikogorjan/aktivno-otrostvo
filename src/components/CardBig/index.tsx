'use client'

import { cn } from '@/utilities/cn'
import Link from 'next/link'
import type React from 'react'
import { Fragment } from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Post } from '@/payload-types'

type Locale = 'sl' | 'en'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'heroImage' | 'excerpt'>

export const CardBig: React.FC<{
  locale: Locale
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = ({ locale, className, doc, relationTo = 'posts', showCategories, title: titleFromProps }) => {
  const { slug, categories, meta, title, heroImage, excerpt } = doc || {}
  const { description, image: metaImage } = meta || {}

  const imageToUse = metaImage ?? heroImage
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const descToUse = excerpt || description
  const sanitizedDescription = descToUse?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`


  return (
    <article
      className={cn(
        'overflow-hidden bg-card border border-border rounded-[12px] rb-12 mb-12 md:mb-16',
        className,
      )}
    >
      <div className="grid grid-cols-1 items-stretch md:grid-cols-2">
        {/* Image */}
        <div className="relative">
          {imageToUse && typeof imageToUse !== 'string' ? (
            <Link href={href} className="block h-full w-full overflow-hidden">
              <div className="relative aspect-[16/10] md:aspect-auto md:h-full bg-black/5">
                <Media
                  resource={imageToUse}
                  imgClassName="h-full w-full object-cover"
                  className="h-full w-full"
                  size="100vw"
                />
              </div>
            </Link>
          ) : (
            <div className="h-full w-full bg-black/5 flex items-center justify-center p-8 text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex h-full flex-col items-start justify-center p-6 md:p-8">
          {showCategories && hasCategories && (
            <div className="uppercase text-sm mb-4 text-muted-foreground">
              {categories?.map((category, index) => {
                if (typeof category === 'object' && category !== null) {
                  const categoryTitle = category.title || 'Untitled category'
                  const isLast = index === categories.length - 1
                  return (
                    <Fragment key={category.id}>
                      {categoryTitle}
                      {!isLast && ', '}
                    </Fragment>
                  )
                }
                return null
              })}
            </div>
          )}

          {titleToUse && (
            <h3 className="font-bebas font-normal mb-2 text-3xl md:text-4xl md:leading-[1.15]">
              {titleToUse}
            </h3>
          )}

          {sanitizedDescription && (
            <p className="mt-2 font-karla text-base md:text-lg text-muted-foreground line-clamp-3">
              {sanitizedDescription}
            </p>
          )}

          <div className="mt-5">
            <CMSLink type="custom" url={href} appearance="link" label="Preberi več" />
          </div>
        </div>
      </div>
    </article>
  )
}
