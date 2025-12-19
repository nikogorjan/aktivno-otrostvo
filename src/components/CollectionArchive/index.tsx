import { Card } from '@/components/Card'
import type { Post } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

type Locale = 'sl' | 'en'

export type Props = {
  locale: Locale
  posts: Array<Pick<Post, 'id' | 'slug' | 'categories' | 'meta' | 'title' | 'heroImage' | 'excerpt'>>
}

export const CollectionArchive: React.FC<Props> = ({ locale, posts }) => {
  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
