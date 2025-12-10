'use client'

import type { Page } from '@/payload-types'
import React, { useEffect } from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
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
  const photo =
    section?.photo && typeof section.photo === 'object'
      ? section.photo
      : undefined

  // linkGroup inside "Storitve" — usually { links: [{ link: {...}, id }] }
  const links = (section as any)?.links as any[] | undefined

  return (
    <section className="bg-[#FBFBFB] py-12 md:py-16 lg:py-20">
      <div className="container space-y-10 lg:space-y-12">
        {/* Top row: heading + copy + buttons */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* LEFT: big title */}
          <div>
            {section?.title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
                {section.title}
              </h1>
            )}
          </div>

          {/* RIGHT: text + buttons */}
          <div className="space-y-6 max-w-xl">
            {section?.richText && (
              <RichText
                data={section.richText}
                enableGutter={false}
                className="text-base md:text-lg leading-relaxed"
              />
            )}

            {links && links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {links.map((item: any, index: number) => {
                  const link = item?.link
                  if (!link) return null

                  // first button = primary (dark), second = secondary (light)
                  const appearance = index === 0 ? 'default' : 'siv'

                  return (
                    <CMSLink
                      key={item.id || index}
                      {...link}
                      appearance={appearance as any}
                      className="inline-flex"
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom: big rounded image */}
        {photo && (
          <div className="relative w-full overflow-hidden rounded-xl bg-muted aspect-[16/9]">
            <Media
              resource={photo}
              fill
              priority
              imgClassName="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}
