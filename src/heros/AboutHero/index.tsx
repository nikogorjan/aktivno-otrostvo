'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { Page } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

type AboutHeroProps = Page['hero']

export const AboutHero: React.FC<AboutHeroProps> = (props) => {
    const { setHeaderTheme } = useHeaderTheme()

    useEffect(() => {
        setHeaderTheme('light')
    }, [setHeaderTheme])

    // Only render for aboutHero
    if (props?.type !== 'aboutHero') return null

    // TS helper: describe the inner group structure
    type AboutGroup = {
        photo?: any
        title?: string
        richText?: any
        links?: any
    }

    // Access the group with the funky name, but keep TS happy with a cast
    const about = (props as any)['O meni'] as AboutGroup | undefined
    const photo =
        about?.photo && typeof about.photo === 'object' ? about.photo : undefined

    return (
        <section className="relative bg-background py-12 md:py-16 lg:py-20">
            <div className="container grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_1.2fr] items-center">
                {/* LEFT: text */}
                <div className="max-w-xl space-y-6">
                    {about?.title && (
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-[600] tracking-tight leading-tight">
                            {about.title}
                        </h1>
                    )}

                    {about?.richText && (
                        <div className="prose max-w-none text-base md:text-lg text-muted-foreground">
                            <RichText data={about.richText} enableGutter={false} />
                        </div>
                    )}

                    {about?.links && (
                        <div className="pt-4">
                            {Array.isArray(about?.links) && about?.links.length > 0 && (
                                <ul className="mt-6 md:mt-8 flex flex-wrap gap-3">
                                    {about?.links.map(({ link }, i) => (
                                        <li key={i}>
                                            <CMSLink {...link} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT: photo */}
                <div className="flex justify-center lg:justify-end">
                    <div className="relative w-full md:max-w-[520px] aspect-square rounded-[12px] overflow-hidden">
                        {photo && (
                            <Media
                                resource={photo}
                                fill
                                priority
                                imgClassName="object-cover"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
