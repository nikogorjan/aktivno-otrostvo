import { RichText } from '@/components/RichText'
import clsx from 'clsx'
import React from 'react'

import type { Post } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { Card } from '../../components/Card'

type Locale = 'sl' | 'en'

export type RelatedPostsProps = {
  locale: Locale
  className?: string
  docs?: Post[]
  introContent?: SerializedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent, locale } = props
  console.log('RELATED FIRST:', docs?.[0]?.heroImage, docs?.[0]?.meta?.image)
  console.log('RELATED FIRST KEYS:', docs?.[0] ? Object.keys(docs[0] as any) : null)

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return (
            <Card
              key={index}
              locale={locale}
              doc={doc}
              relationTo="posts"
              showCategories
            />
          )
        })}
      </div>
    </div>
  )
}
