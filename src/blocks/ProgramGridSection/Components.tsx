'use client'

import type { ProgramGridSectionBlock } from '@/payload-types'
import type { DefaultDocumentIDType } from 'payload'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { cn } from '@/utilities/cn'
import { ChevronRight } from 'lucide-react'

const BG_COLOR_MAP: Record<string, string> = {
    roza: 'bg-roza',
    oranzna: 'bg-oranzna',
    rumena: 'bg-rumena',
    zelena: 'bg-zelena',
    vijolicna: 'bg-vijolicna',
    modra: 'bg-modra',
    mint: 'bg-mint',
}

export const ProgramGridSection: React.FC<
    ProgramGridSectionBlock & { id?: DefaultDocumentIDType; className?: string }
> = ({ programs, className }) => {
    if (!Array.isArray(programs) || programs.length === 0) return null

    return (
        <section className={cn('py-12 md:py-16 lg:py-20', className)}>
            <div className="container">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {programs.map((item, index) => {
                        const bgClass = BG_COLOR_MAP[item.backgroundColor || 'roza']

                        const link = item?.links?.[0]?.link

                        const rawLink = item?.links?.[0]?.link
                        if (!rawLink) return null

                        const { label, ...linkProps } = rawLink

                        return (
                            <div
                                key={index}
                                className={cn(
                                    'rounded-xl overflow-hidden p-2 flex flex-col',
                                    bgClass,
                                )}
                            >
                                {/* IMAGE */}
                                <div className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden rounded-b-none">
                                    {item.media && typeof item.media === 'object' && (
                                        <Media
                                            resource={item.media}
                                            fill
                                            imgClassName="object-cover"
                                        />
                                    )}
                                </div>

                                {/* CONTENT */}
                                <div className="p-6 space-y-4 flex flex-col flex-1">
                                    <h3 className="text-2xl font-semibold">{item.title}</h3>

                                    {item.description && (
                                        <div className="text-muted-foreground text-base">
                                            <RichText
                                                data={item.description}
                                                enableGutter={false}
                                            />
                                        </div>
                                    )}

                                    {/* BUTTON */}
                                    {rawLink && (
                                        <CMSLink
                                            {...linkProps}
                                            appearance="nav"
                                            className="mt-auto w-max inline-flex items-center gap-1 pl-0 [&>a]:pl-0"
                                        >
                                            <span>{label}</span>
                                            <ChevronRight className="size-4" />
                                        </CMSLink>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
