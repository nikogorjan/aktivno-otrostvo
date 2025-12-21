import { Card } from '@/components/Card'
import type { Post } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

type Locale = 'sl' | 'en'

export type Props = {
  locale: Locale
  posts: Array<Pick<Post, 'id' | 'slug' | 'categories' | 'meta' | 'title' | 'heroImage' | 'excerpt'>>
  columns?: 2 | 3
}

export const CollectionArchive: React.FC<Props> = ({ locale, posts, columns = 3 }) => {
  const gridCols =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={cn('container px-0')}>
      <div className={cn('grid gap-6 md:gap-8', gridCols)}>
        {posts?.map((post) => (
          <Card
            key={post.id}
            locale={locale}
            doc={post}
            relationTo="posts"
            showCategories
            className="h-full"
          />
        ))}
      </div>
    </div>
  )
}
