'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { VideoSectionBlock as VideoSectionBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

const BG_COLOR_MAP: Record<string, string> = {
  roza: 'bg-roza',
  oranzna: 'bg-oranzna',
  rumena: 'bg-rumena',
  zelena: 'bg-zelena',
  vijolicna: 'bg-vijolicna',
  modra: 'bg-modra',
  mint: 'bg-mint',
}

export const VideoSectionBlock: React.FC<
  VideoSectionBlockProps & { id?: DefaultDocumentIDType; className?: string }
> = (props) => {
  const { heading, description, links, media, backgroundColor, mediaTitle, browserUrl, className } =
    props

  const bgClass = BG_COLOR_MAP[backgroundColor || 'modra'] ?? BG_COLOR_MAP.modra

  return (
    <section className={cn('py-10 md:py-14 lg:py-20', className)}>
      {/* Top row: heading (left) + description + buttons (right) */}
      <div className="container">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_1.1fr] lg:gap-12">
          {heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              {heading}
            </h2>
          )}

          <div>
            {description && (
              <div className="prose max-w-none text-base md:text-lg text-muted-foreground">
                <RichText data={description} enableGutter={false} />
              </div>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <ul className="mt-6 md:mt-8 flex flex-wrap gap-3">
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

      {/* Video "browser" frame */}
      <div className="container mt-10 md:mt-12">
        <div
          className={cn(
            'rounded-xl p-6 md:p-12 lg:p-16',
            bgClass,
          )}
        >
          <div className="w-full">
            {/* Browser window card */}
            <div className="overflow-hidden rounded-xl bg-white shadow-lg">
              {/* Browser top bar */}
              <div className="flex items-center justify-between border-b px-4 py-2.5 md:px-6 md:py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="hidden flex-1 items-center justify-center md:flex">
                  <div className="max-w-sm flex-1 rounded-full border bg-muted px-3 py-1.5 text-center text-xs text-muted-foreground truncate">
                    {browserUrl || 'website.com'}
                  </div>
                </div>
                <div className="w-8" />
              </div>

              {/* Inner content: title + media */}
              <div className="px-4 pb-4 pt-3 md:px-6 md:py-12 max-w-3xl mx-auto">
                {mediaTitle && (
                  <p className="mb-3 text-xl font-semibold text-foreground md:text-4xl md:max-w-[420px] md:pb-4">
                    {mediaTitle}
                  </p>
                )}

                <div className="relative w-full overflow-hidden rounded-[10px] bg-black/5 aspect-video">
                  {media && typeof media === 'object' && (
                    <Media
                      resource={media}
                      imgClassName="object-cover"
                      videoClassName="w-full h-full object-cover"

                      videoControls
                      videoAutoPlay={true}
                      videoLoop={true}
                      videoMuted={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
