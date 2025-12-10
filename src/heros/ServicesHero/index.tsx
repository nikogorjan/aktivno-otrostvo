'use client'

import type { Page } from '@/payload-types'
import React, { useEffect } from 'react'

import { RichText } from '@/components/RichText'
import { useHeaderTheme } from '@/providers/HeaderTheme'

type HeroProps = Page['hero']

// type guard for services hero
const isServicesHero = (
  hero: HeroProps,
): hero is HeroProps & { Storitve: NonNullable<HeroProps['Storitve']> } =>
  hero?.type === 'servicesHero'

export const ServicesHero: React.FC<HeroProps> = (hero) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  if (!isServicesHero(hero)) return null

  const section = hero.Storitve

  return (
    <section className="bg-[#FBFBFB] py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl space-y-4 md:space-y-6 text-center">
          {section?.title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
              {section.title}
            </h1>
          )}

          {section?.richText && (
            <RichText
              data={section.richText}
              enableGutter={false}
              className="text-base md:text-lg leading-relaxed text-muted-foreground"
            />
          )}
        </div>
      </div>
    </section>
  )
}
