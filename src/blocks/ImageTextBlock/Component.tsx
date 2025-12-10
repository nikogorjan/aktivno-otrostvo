'use client'

import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { ImageTextSectionBlock as ImageTextSectionBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'

const BG_COLOR_MAP: Record<string, string> = {
  roza: 'bg-roza',
  oranzna: 'bg-oranzna',
  rumena: 'bg-rumena',
  zelena: 'bg-zelena',
  vijolicna: 'bg-vijolicna',
  modra: 'bg-modra',
  mint: 'bg-mint',
}

export const ImageTextSectionBlock: React.FC<
  ImageTextSectionBlockProps & { id?: DefaultDocumentIDType; className?: string }
> = (props) => {
  const { heading, description, media, backgroundColor, alignment, className } = props

  const bgClass = BG_COLOR_MAP[backgroundColor || 'roza'] ?? BG_COLOR_MAP.roza
  const isImageLeft = alignment === 'imageLeft'

  return (
    <section className={cn('py-12 md:py-16 lg:py-20', className)}>
      <div className="container">
        <div
          className={cn(
            'grid gap-10 lg:gap-20 items-center',
            'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]',
          )}
        >
          {/* TEXT COLUMN */}
          <div className={cn('space-y-4 md:space-y-5 max-w-xl', isImageLeft && 'lg:order-2')}>
            {heading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
                {heading}
              </h2>
            )}

            {description && (
              <div className="text-base md:text-lg text-muted-foreground">
                <RichText data={description} enableGutter={false} />
              </div>
            )}
          </div>

          {/* IMAGE COLUMN */}
          <div className={cn('flex justify-center lg:justify-end', isImageLeft && 'lg:order-1')}>
            <div
              className={cn(
                'rounded-xl p-4 md:p-6 lg:p-7',
                bgClass,
                'w-full ',
              )}
            >
              <div className="relative w-full rounded-[10px] bg-muted overflow-hidden aspect-square md:aspect-image">
                {media && typeof media === 'object' && (
                  <Media resource={media} fill imgClassName="object-cover" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
