'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { AboutUsSectionBlock as AboutUsSectionBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

export const AboutUsSectionBlock: React.FC<
  AboutUsSectionBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = (props) => {
  const { heading, description, links, media, className } = props

  return (
    <section className={cn('py-6 md:py-12 lg:py-16', className)}>
      {/* Top row: heading (left) + description + buttons (right) */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-10 items-start">
          {heading && <h2 className="text-4xl md:text-5xl font-medium">{heading}</h2>}

          <div>
            {description && (
              <div className="text-lg text-muted-foreground">
                <RichText data={description} enableGutter={false} />
              </div>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-3">
                {links.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="container mt-8">
        <div className="relative w-full overflow-hidden rounded-[0.8rem] border border-border aspect-[16/6]">
          <Media resource={media} fill imgClassName="object-cover" />
        </div>
      </div>
    </section>
  )
}
