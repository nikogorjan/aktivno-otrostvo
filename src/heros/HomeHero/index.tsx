// src/heros/HomeHero/index.tsx
'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { Page } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

// ✅ HomeHero now lives inside the `hero` group
type HomeHeroProps = Page['hero']

// Narrowing helper – only render when type === 'homeHero'
const isHomeHero = (
  h: HomeHeroProps,
): h is HomeHeroProps & Required<Pick<HomeHeroProps, 'left' | 'right'>> => h?.type === 'homeHero'

type ArrayElement<T> = T extends Array<infer U> ? U : never

type Left = NonNullable<HomeHeroProps['left']>
type Links = NonNullable<Left['links']>
type LinkRow = ArrayElement<Links> // instead of Left['links'][number]

type Right = NonNullable<HomeHeroProps['right']>
type Columns = NonNullable<Right['columns']>
type Column = ArrayElement<Columns> // instead of ...['columns'][number]
type Card = ArrayElement<NonNullable<Column['cards']>>

export const HomeHero: React.FC<HomeHeroProps> = (props) => {
  // If someone tries to render this while type !== 'homeHero', bail gracefully
  if (!isHomeHero(props)) return null

  const { left, right } = props

  const { setHeaderTheme } = useHeaderTheme()
  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const stars = Math.max(0, Math.min(5, left?.stars ?? 0))

  return (
    <section className="relative pt-16 md:pt-24">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* LEFT */}
        <div className="max-w-[46rem]">
          {(left?.tagline || stars > 0) && (
            <div className="mb-4 flex items-center gap-3">
              {stars > 0 && (
                <div className="flex">
                  {Array.from({ length: stars }).map((_, i) => (
                    <span key={i} aria-hidden className="i-lucide-star w-5 h-5" />
                  ))}
                </div>
              )}
              {left?.tagline && (
                <span className="text-sm text-muted-foreground">{left.tagline}</span>
              )}
            </div>
          )}

          {left?.title && (
            <RichText data={left.title} className="mb-6 [&_h1]:text-5xl md:[&_h1]:text-6xl" />
          )}

          {left?.description && (
            <RichText data={left.description} className="mb-6 text-lg text-muted-foreground" />
          )}

          {Array.isArray(left?.links) && left.links.length > 0 && (
            <ul className="flex gap-3">
              {left.links.map(({ link }: LinkRow, i: number) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT GRID */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          {(right?.columns ?? []).map((col: Column, colIdx: number) => (
            <div key={colIdx} className="flex flex-col gap-4 lg:gap-6">
              {(col.cards ?? []).map((card: Card, cardIdx: number) => {
                if (card.blockType === 'imageCard') {
                  return (
                    <div key={cardIdx} className="relative overflow-hidden rounded-2xl">
                      {card.media && typeof card.media === 'object' && (
                        <Media resource={card.media} imgClassName="object-cover" priority />
                      )}
                      {(card.badge || card.badgeIcon) && (
                        <div className="absolute left-3 bottom-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow">
                          {card.badgeIcon && typeof card.badgeIcon === 'object' && (
                            <div className="relative h-5 w-5 overflow-hidden rounded-full">
                              <Media resource={card.badgeIcon} imgClassName="object-contain" />
                            </div>
                          )}
                          {card.badge && <span className="text-sm font-medium">{card.badge}</span>}
                        </div>
                      )}
                    </div>
                  )
                }

                if (card.blockType === 'infoCard') {
                  return (
                    <div
                      key={cardIdx}
                      className="rounded-2xl bg-muted/50 p-5 md:p-6 flex flex-col gap-2"
                    >
                      {card.icon && typeof card.icon === 'object' && (
                        <div className="h-8 w-8">
                          <Media resource={card.icon} imgClassName="object-contain" />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold">{card.heading}</h3>
                      {card.body && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
                      )}
                    </div>
                  )
                }

                return null
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
