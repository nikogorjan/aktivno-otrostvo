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

export const Card: React.FC<{
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
        'h-full rounded-[12px] border border-border bg-card overflow-hidden flex flex-col',
        className,
      )}
    >
      {/* Image */}
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] bg-black/5">
          {imageToUse && typeof imageToUse !== 'string' ? (
            <Media resource={imageToUse} imgClassName="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {showCategories && hasCategories && (
          <div className="uppercase text-xs mb-3 text-muted-foreground">
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
          <h3 className="font-bebas font-normal text-2xl leading-tight">{titleToUse}</h3>
        )}

        {sanitizedDescription && (
          <p className="mt-2 text-sm md:text-base text-muted-foreground line-clamp-3 font-karla">
            {sanitizedDescription}
          </p>
        )}

        <div className="mt-4">
          <CMSLink type="custom" url={href} appearance="link" label="Preberi več" />
        </div>
      </div>
    </article>
  )
}
