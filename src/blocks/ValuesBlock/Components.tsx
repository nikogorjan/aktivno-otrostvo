// src/blocks/ValuesSectionBlock.tsx
'use client'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { ValuesSectionBlock as ValuesSectionBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import * as React from 'react'

const ICON_BG_COLORS: Record<string, string> = {
    roza: 'bg-roza',
    oranzna: 'bg-oranzna',
    rumena: 'bg-rumena',
    zelena: 'bg-zelena',
    vijolicna: 'bg-vijolicna',
    modra: 'bg-modra',
    mint: 'bg-mint',
}

export const ValuesSectionBlock: React.FC<
    ValuesSectionBlockProps & { className?: string }
> = ({ heading, description, values = [], className }) => {
    if (!values.length) return null

    return (
        <section className={cn('py-10 md:py-16 lg:py-20', className)}>
            {/* Heading + intro */}
            <div className="container text-center">
                {heading && (
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                        {heading}
                    </h2>
                )}

                {description && (
                    <div className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
                        <RichText data={description} enableGutter={false} />
                    </div>
                )}
            </div>

            {/* Values grid */}
            <div className="container mt-10 md:mt-12">
                <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {values.map((item, i) => {
                        const colorClass =
                            ICON_BG_COLORS[item.color || 'roza'] ?? ICON_BG_COLORS.roza

                        return (
                            <article
                                key={i}
                                className="h-full rounded-[12px] border border-border bg-card p-6 md:p-8 flex flex-col"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={cn(
                                            'flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full',
                                            colorClass,
                                        )}
                                    >
                                        {item.icon && typeof item.icon === 'object' && (
                                            <div className="h-6 w-6 flex items-center justify-center">
                                                <Media resource={item.icon} imgClassName="object-contain" />
                                            </div>
                                        )}
                                    </div>

                                    {item.title && (
                                        <h3 className="text-xl md:text-2xl font-semibold leading-tight">
                                            {item.title}
                                        </h3>
                                    )}
                                </div>

                                {item.description && (
                                    <div className="mt-4 text-sm md:text-base text-muted-foreground">
                                        <RichText data={item.description} enableGutter={false} />
                                    </div>
                                )}
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
