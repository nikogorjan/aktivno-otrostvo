'use client'

import { Media } from '@/components/Media'
import type { Post } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Link from 'next/link'

type Locale = 'sl' | 'en'

export type TrendingPostData = Pick<Post, 'slug' | 'title' | 'heroImage' | 'meta'>

export const TrendingPostItem: React.FC<{
  locale: Locale
  doc: TrendingPostData
  className?: string
}> = ({ locale, doc, className }) => {
  const imageToUse = (doc.meta?.image ?? doc.heroImage) as any
  const href = `/${locale}/posts/${doc.slug}`

  return (
    <Link href={href} className={cn('group flex gap-3 items-center', className)}>
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-[6px] bg-black/5 border border-border">
        {imageToUse && typeof imageToUse !== 'string' ? (
          <Media
            fill
            resource={imageToUse}
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover"
            size="128px"
          />
        ) : null}
      </div>

      <div className="min-w-0">
        <p className="text-xl md:text-2xl text-foreground leading-snug group-hover:underline line-clamp-2">
          {doc.title}
        </p>
      </div>
    </Link>
  )
}
