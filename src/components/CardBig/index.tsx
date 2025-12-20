'use client'

import { cn } from '@/utilities/cn'
import Link from 'next/link'
import type React from 'react'

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
}> = ({ locale, className, doc, relationTo = 'posts', showCategories = true, title: titleFromProps }) => {
  const { slug, categories, meta, title, heroImage, excerpt } = doc || {}
  const { description, image: metaImage } = meta || {}

  const imageToUse = metaImage ?? heroImage

  const titleToUse = titleFromProps || title
  const descToUse = excerpt || description
  const sanitizedDescription = descToUse?.replace(/\s/g, ' ')

  // ✅ Locale-aware URL
  const href = slug ? `/${locale}/${relationTo}/${slug}` : `/${locale}/${relationTo}`
const cmsHref = slug ? `/${relationTo}/${slug}` : `/${relationTo}`

  // ✅ Minimalist primary category tagline (first resolved category)
  const primaryCategory =
    showCategories && categories
      ? categories.find((c): c is Exclude<typeof c, string> => typeof c === 'object' && c !== null)
      : undefined

  console.log(primaryCategory);

  const categoryTaglines =
    showCategories && categories
      ? categories
        .filter((c): c is Exclude<typeof c, string> => typeof c === 'object' && c !== null)
        .map((c) => c.title)
        .filter(Boolean)
        .slice(0, 3) // choose how many to show
      : []

  return (
    <article
      className={cn(
        'overflow-hidden bg-card border border-border rounded-[10px] rb-12 mb-12 md:mb-16',
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
          {/* ✅ Minimalist tagline */}
          {categoryTaglines.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {categoryTaglines.map((tagline) => (
                <span
                  key={tagline}
                  className="
          inline-flex items-center
          rounded-[4px]
          border border-foreground/20
          bg-foreground/5
          px-3 py-1
          text-[11px] font-semibold uppercase tracking-wide
          text-foreground/80
        "
                >
                  {tagline}
                </span>
              ))}
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
           <CMSLink type="custom" url={cmsHref} appearance="link" label="Preberi več" />

          </div>
        </div>
      </div>
    </article>
  )
}
