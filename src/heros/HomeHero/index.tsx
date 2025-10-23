'use client'

import leafAnimation from '@/../public/lottie/green-leaf.json'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Page } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import { Star } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

type HomeHeroProps = Page['hero']

const isHomeHero = (
  h: HomeHeroProps,
): h is HomeHeroProps & Required<Pick<HomeHeroProps, 'left' | 'right'>> => h?.type === 'homeHero'

type ArrayElement<T> = T extends Array<infer U> ? U : never

type Left = NonNullable<HomeHeroProps['left']>
type Links = NonNullable<Left['links']>
type LinkRow = ArrayElement<Links>

type Right = NonNullable<HomeHeroProps['right']>
type Columns = NonNullable<Right['columns']>
type Column = ArrayElement<Columns>
type Card = ArrayElement<NonNullable<Column['cards']>>

const INFO_CARD_STYLES: Record<string, string> = {
  roza: 'bg-roza text-roza-dark',
  rumena: 'bg-rumena text-rumena-dark',
  modra: 'bg-modra text-modra-dark',
}

export const HomeHero: React.FC<HomeHeroProps> = (props) => {
  // ✅ Hooks must be called unconditionally and before any early returns
  const { setHeaderTheme } = useHeaderTheme()
  const lottieRef = React.useRef<LottieRefCurrentProps>(null)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  React.useEffect(() => {
    lottieRef.current?.setSpeed(0.3)
  }, [])

  // Guard AFTER hooks have been called
  if (!isHomeHero(props)) return null

  const { left, right } = props
  const stars = Math.max(0, Math.min(5, left?.stars ?? 0))

  return (
    <section className="relative py-10 md:py-16 lg:py-20 bg-card/30">
      <div className="container grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 items-start">
        {/* LEFT */}
        <div className="max-w-[46rem] h-full flex flex-col justify-between md:py-12">
          <div>
            {(left?.tagline || stars > 0) && (
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-card border-border border px-2.5 py-1">
                {stars > 0 && (
                  <div className="flex text-kournikova">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                )}
                {left?.tagline && (
                  <span className="text-sm text-foreground font-medium">{left.tagline}</span>
                )}
              </div>
            )}

            {left?.title && <h1 className="mb-6 text-5xl md:text-6xl font-medium">{left.title}</h1>}
          </div>
          <div>
            <div className="relative mb-6">
              {left?.description && (
                <p className="text-lg text-muted-foreground">{left.description}</p>
              )}

              <div className="absolute -top-10 -right-2 w-20 h-20 pointer-events-none rotate-20">
                <Lottie lottieRef={lottieRef} animationData={leafAnimation} loop autoplay />
              </div>
            </div>

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
        </div>

        {/* RIGHT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {(right?.columns ?? []).map((col: Column, colIdx: number) => (
            <div key={colIdx} className="flex flex-col gap-4 h-full min-h-0">
              {(col.cards ?? []).map((card: Card, cardIdx: number) => {
                const href = 'href' in card && card.href ? card.href : undefined
                const isLinked = !!href

                if (card.blockType === 'imageCard') {
                  const Img = (
                    <div
                      className={`relative overflow-hidden rounded-lg aspect-[215/354]
                          ${isLinked ? 'cursor-pointer  transition-transform duration-200' : ''}
                        `}
                    >
                      {card.media && typeof card.media === 'object' && (
                        <Media resource={card.media} fill imgClassName="object-cover" priority />
                      )}
                      {(card.badge || card.badgeIcon) && (
                        <div className="absolute bottom-4 left-0 flex items-center gap-2 rounded-r-full bg-white pr-1 pl-3 py-1 translate-y-[-18px]">
                          {card.badge && <span className="text-sm font-medium">{card.badge}</span>}
                          {card.badgeIcon && typeof card.badgeIcon === 'object' && (
                            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-neutral-dark p-1">
                              <Media resource={card.badgeIcon} imgClassName="object-contain" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )

                  return isLinked ? (
                    <Link key={cardIdx} href={href!} className="block">
                      {Img}
                    </Link>
                  ) : (
                    <React.Fragment key={cardIdx}>{Img}</React.Fragment>
                  )
                }

                if (card.blockType === 'infoCard') {
                  const styleClasses =
                    INFO_CARD_STYLES[card.color || 'roza'] ?? INFO_CARD_STYLES.roza

                  return (
                    <div
                      key={cardIdx}
                      className={`
                        rounded-lg p-5 md:p-6 flex flex-col gap-2 transition-all duration-200 min-h-0
                        ${styleClasses}
                        ${isLinked ? 'cursor-pointer' : ''}
                        flex-1
                      `}
                    >
                      {isLinked ? (
                        <Link href={href!} className="h-full flex flex-col justify-between gap-2">
                          {card.icon && typeof card.icon === 'object' && (
                            <div className="h-12 w-12">
                              <Media resource={card.icon} imgClassName="object-contain" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold">{card.heading}</h3>
                            {card.body && (
                              <p className="text-sm leading-relaxed opacity-80">{card.body}</p>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <>
                          {card.icon && typeof card.icon === 'object' && (
                            <div className="h-12 w-12">
                              <Media resource={card.icon} imgClassName="object-contain" />
                            </div>
                          )}
                          <div className="h-full flex flex-col justify-between gap-2">
                            <h3 className="text-lg font-semibold">{card.heading}</h3>
                            {card.body && <p className="text-sm leading-relaxed">{card.body}</p>}
                          </div>
                        </>
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
