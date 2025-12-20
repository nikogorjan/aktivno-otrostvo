'use client'

import { cn } from '@/utilities/cn'
import Link from 'next/link'
import type React from 'react'

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
}> = ({ locale, className, doc, relationTo = 'posts', showCategories = true, title: titleFromProps }) => {
  const { slug, categories, meta, title, heroImage, excerpt } = doc || {}
  const { description, image: metaImage } = meta || {}

  const imageToUse = metaImage ?? heroImage

  const titleToUse = titleFromProps || title
  const descToUse = excerpt || description
  const sanitizedDescription = descToUse?.replace(/\s/g, ' ')

  // ✅ Locale-aware URL
  const href = slug ? `/${locale}/${relationTo}/${slug}` : `/${locale}/${relationTo}`

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
        'h-full rounded-[10px] border border-border bg-card overflow-hidden flex flex-col',
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

        {titleToUse && <h3 className="font-bebas font-normal text-2xl leading-tight">{titleToUse}</h3>}

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
