// src/blocks/CtaBackgroundSectionBlock.tsx
'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { CtaBackgroundSectionBlock as CtaBackgroundSectionBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import * as React from 'react'

export const CtaBackgroundSectionBlock: React.FC<
  CtaBackgroundSectionBlockProps & { className?: string }
> = ({ heading, description, links, backgroundImage, className }) => {
  const bg = backgroundImage && typeof backgroundImage === 'object' ? backgroundImage : undefined

  const hasButtons = Array.isArray(links) && links.length > 0

  return (
    <section className={cn('relative overflow-hidden px-[5%] py-12 md:py-20 lg:py-24', className)}>
      {/* Background image + overlay */}
      <div className="absolute inset-0 -z-10">
        {bg && <Media resource={bg} fill priority imgClassName="object-cover" />}
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content */}
      <div className="container max-w-2xl text-center text-white">
        {heading && (
          <h2 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            {heading}
          </h2>
        )}

        {description && (
          <div className="text-base md:text-lg text-white/85">
            <RichText data={description} enableGutter={false} />
          </div>
        )}

        {hasButtons && (
          <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {links!.map(({ link }, i) => (
              <CMSLink key={i} {...link} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
