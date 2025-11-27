'use client'

import { Media } from '@/components/Media'
import type { Page } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import React, { useEffect } from 'react'

type HomeHeroProps = Page['hero']

const isHomeHero = (
  h: HomeHeroProps,
): h is HomeHeroProps & Required<Pick<HomeHeroProps, 'left' | 'right'>> => h?.type === 'homeHero'

type ArrayElement<T> = T extends Array<infer U> ? U : never
type Right = NonNullable<HomeHeroProps['right']>
type Cards = NonNullable<Right['cards']>
type Card = ArrayElement<Cards>

const INFO_CARD_STYLES: Record<string, string> = {
  roza: 'bg-roza hover:bg-roza-hover',
  oranzna: 'bg-oranzna hover:bg-oranzna-hover',
  rumena: 'bg-rumena hover:bg-rumena-hover',
  zelena: 'bg-zelena hover:bg-zelena-hover',
  vijolicna: 'bg-vijolicna hover:bg-vijolicna-hover',
  modra: 'bg-modra hover:bg-modra-hover',
  mint: 'bg-mint hover:bg-mint-hover',
}

export const HomeHero: React.FC<HomeHeroProps> = (props) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  if (!isHomeHero(props)) return null

  const { left, right } = props
  const cards = (right?.cards ?? []) as Card[]

  // Expect exactly 7 cards, but be defensive
  const row1 = cards.slice(0, 3)
  const middleRight = cards[3]
  const row3 = cards.slice(4, 7)

  const heroPhoto = left?.photo && typeof left.photo === 'object' ? left.photo : undefined

  const renderInfoCard = (card: Card | undefined, key: React.Key, extraClass = '') => {
    if (!card || card.blockType !== 'infoCard') {
      return <div key={key} />
    }

    const href = 'href' in card && card.href ? card.href : undefined
    const isLinked = !!href
    const styleClasses = INFO_CARD_STYLES[card.color || 'roza'] ?? INFO_CARD_STYLES.roza

    const inner = (
      <div className="w-full h-full aspect-square lg:aspect-[4/3]">
        <div
          className={`
            w-full h-full rounded-xl px-6 py-7 flex flex-col items-center justify-center text-center
            transition-all duration-500 hover:-translate-y-1
            ${styleClasses}
            ${isLinked ? 'cursor-pointer' : ''}
            ${extraClass}
          `}
        >
          {card.icon && typeof card.icon === 'object' && (
            <div className="mb-2 h-10 w-10 flex flex-col items-center justify-center">
              <Media resource={card.icon} imgClassName="object-contain" />
            </div>
          )}
          <h3 className="text-sm md:text-base font-semibold leading-snug">{card.heading}</h3>
          {card.body && (
            <p className="mt-2 text-xs md:text-sm leading-relaxed opacity-80">{card.body}</p>
          )}
        </div>
      </div>
    )

    return isLinked ? (
      <Link key={key} href={href} className="block h-full">
        {inner}
      </Link>
    ) : (
      <React.Fragment key={key}>{inner}</React.Fragment>
    )
  }

  return (
    <section className="relative bg-background py-12 md:py-16 lg:py-20">
      <div
        className="
          container 
          grid grid-cols-1 
          items-center lg:items-stretch 
          gap-4 lg:grid-cols-[1.1fr_1.4fr] lg:gap-16
        "
      >
        {/* LEFT: mobile title + image */}
        <div className="mb-0 text-center lg:hidden">
          {left?.tagline && (
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {left.tagline}
            </p>
          )}
          {left?.title && <h1 className="text-5xl font-[800] leading-tight mb-8">{left.title}</h1>}
          {left?.subtitle && <p className="mt-2 text-sm text-muted-foreground">{left.subtitle}</p>}
        </div>

        {/* LEFT: image */}
        <div className="flex justify-center lg:h-full">
          <div
            className="
              relative 
              w-full max-w-[520px] 
              overflow-hidden rounded-xl bg-muted
              aspect-[3/4] lg:aspect-auto lg:h-full
            "
          >
            {heroPhoto && (
              <Media resource={heroPhoto} fill priority imgClassName="object-cover" />
            )}
          </div>
        </div>

        {/* RIGHT: grid + title */}
        <div className="w-full h-full">
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6 h-full">
            {/* Row 1: three cards */}
            {row1.map((card, idx) => renderInfoCard(card, `row1-${idx}`))}

            {/* Row 2: heading (col-span-2) + right card */}
            <div
              className="
                hidden lg:flex md:col-span-2 md:row-start-2
                h-full rounded-3xl bg-white 
                items-center justify-center text-center px-6 
              "
            >
              <div className="text-left">
                {left?.tagline && (
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {left.tagline}
                  </p>
                )}
                {left?.title && (
                  <h2 className="text-6xl font-[800] tracking-tight leading-tight">
                    {left.title}
                  </h2>
                )}
                {left?.subtitle && (
                  <p className="mt-2 text-sm text-muted-foreground">{left.subtitle}</p>
                )}
              </div>
            </div>

            {renderInfoCard(middleRight, 'middle-right', 'md:row-start-2 md:col-start-3')}

            {/* Row 3: three cards */}
            {row3.map((card, idx) => renderInfoCard(card, `row3-${idx}`))}
          </div>
        </div>
      </div>
    </section>
  )
}
