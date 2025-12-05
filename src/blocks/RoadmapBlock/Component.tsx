// src/blocks/RoadmapSectionBlock.tsx
'use client'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { RoadmapSectionBlock as RoadmapSectionBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { motion } from 'framer-motion'
import * as React from 'react'

const CARD_COLORS: Record<string, string> = {
  roza: 'bg-roza/10 border-roza/30',
  modra: 'bg-modra/10 border-modra/30',
  rumena: 'bg-rumena/10 border-rumena/30',
}

const BADGE_COLORS: Record<string, string> = {
  roza: 'bg-roza text-foreground',
  modra: 'bg-modra text-foreground',
  rumena: 'bg-rumena text-foreground',
}

export const RoadmapSectionBlock: React.FC<
  RoadmapSectionBlockProps & { className?: string }
> = ({ heading, description, items = [], className }) => {
  if (!items.length) return null

  return (
    <section className={cn('py-12 md:py-20 lg:py-24', className)}>
      {/* Heading + intro */}
      <div className="container max-w-3xl text-center">
        {heading && (
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            {heading}
          </h2>
        )}

        {description && (
          <div className="mt-4 text-base md:text-lg text-muted-foreground">
            <RichText data={description} enableGutter={false} />
          </div>
        )}
      </div>

      {/* Roadmap stack */}
      <div className="container mt-10 md:mt-14 lg:mt-16">
        <div className="relative">
          {items.map((item, index) => {
            const cardColor =
              CARD_COLORS[item.color || 'roza'] ?? CARD_COLORS.roza
            const badgeColor =
              BADGE_COLORS[item.color || 'roza'] ?? BADGE_COLORS.roza

            return (
              // Each step has tall space so sticky card can stack while scrolling
              <div
                key={index}
                className={cn(
                  'relative',
                  // more height on larger screens for a nicer scroll effect
                  'h-[70vh] md:h-[80vh] last:pb-10',
                )}
              >
                <motion.article
                  className={cn(
                    'sticky top-24 md:top-28 lg:top-32',
                    'max-w-5xl mx-auto rounded-3xl border shadow-sm',
                    'bg-card/90 backdrop-blur-sm',
                    cardColor,
                  )}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.5, once: false }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <div className="grid gap-6 md:gap-10 md:grid-cols-[1.1fr_1.4fr] p-6 md:p-10 lg:p-12">
                    {/* Text side */}
                    <div className="flex flex-col justify-center space-y-4 md:space-y-6">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold',
                            badgeColor,
                          )}
                        >
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        {item.title && (
                          <h3 className="text-xl md:text-2xl font-semibold leading-tight">
                            {item.title}
                          </h3>
                        )}
                      </div>

                      {item.description && (
                        <div className="text-sm md:text-base text-muted-foreground">
                          <RichText
                            data={item.description}
                            enableGutter={false}
                          />
                        </div>
                      )}
                    </div>

                    {/* Image side */}
                    <div className="relative">
                      <div className="relative h-56 md:h-72 lg:h-80 w-full overflow-hidden rounded-2xl">
                        {item.image && (
                          <Media
                            resource={item.image}
                            fill
                            imgClassName="object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
