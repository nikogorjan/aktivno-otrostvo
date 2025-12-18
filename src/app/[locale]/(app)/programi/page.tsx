import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { Lesson, ProgramCategory } from '@/payload-types'
import { cn } from '@/utilities/cn'

import { CarouselWithIndicators } from '@/components/ui/carousel-indicators'
import { getTranslations } from 'next-intl/server'


type Locale = 'sl' | 'en'

type PageProps = {
    params: Promise<{ locale: Locale }>
}

const BG_COLOR_MAP: Record<string, string> = {
    roza: 'bg-roza',
    oranzna: 'bg-oranzna',
    rumena: 'bg-rumena',
    zelena: 'bg-zelena',
    vijolicna: 'bg-vijolicna',
    modra: 'bg-modra',
    mint: 'bg-mint',
}

export default async function ProgramsPage({ params }: PageProps) {
    const { locale } = await params
    const payload = await getPayload({ config: configPromise })

    // 1) Fetch all programs
    const programsRes = await payload.find({
        collection: 'programCategories',
        locale,
        pagination: false,
        depth: 1,
        sort: 'order',
    })

    const programs = programsRes.docs as ProgramCategory[]
    if (!programs.length) return notFound()

    // 2) Fetch all lessons once
    const lessonsRes = await payload.find({
        collection: 'lessons',
        locale,
        pagination: false,
        depth: 1,
        limit: 1000,
        sort: 'order', // 👈 IMPORTANT
    })

    const lessons = lessonsRes.docs as Lesson[]
    const t = await getTranslations({ locale, namespace: 'Programs' })


    return (
        <main className="bg-[#FBFBFB]">
            <section className="container py-10 md:py-14 lg:py-16 space-y-16">
                {programs.map(async (program) => {
                    const programLessons = lessons
                        .filter((lesson) => {
                            const programId =
                                typeof lesson.program === 'string'
                                    ? lesson.program
                                    : lesson.program?.id

                            return programId === program.id
                        })
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) // 👈 IMPORTANT

                    const bgClass =
                        BG_COLOR_MAP[(program.backgroundColor as string) || 'modra'] ??
                        BG_COLOR_MAP.modra
                    const t = await getTranslations({ locale, namespace: 'Programs' })

                    return (
                        <section key={program.id}>
                            {/* Program header */}
                            <div className="flex items-center gap-4 mb-6">
                                {/* Icon circle */}
                                <div
                                    className={cn(
                                        'flex h-14 w-14 shrink-0 items-center justify-center rounded-full',
                                        bgClass,
                                    )}
                                >
                                    {program.icon && typeof program.icon === 'object' && (
                                        <Media
                                            resource={program.icon}
                                            imgClassName="h-7 w-7 object-contain"
                                        />
                                    )}
                                </div>

                                {/* Title + Read more */}
                                <div className="flex w-full items-center justify-between gap-4">
                                    <h2 className="text-2xl md:text-3xl font-semibold">
                                        {program.title}
                                    </h2>

                                    <Link
                                        href={`/${locale}/programi/${program.slug}`}
                                        className="text-sm md:text-base font-medium underline underline-offset-4 hover:opacity-80"
                                    >
                                        {t('readMore')}
                                    </Link>
                                </div>
                            </div>

                            {/* Lessons grid */}
                            {programLessons.length > 0 ? (
                                <>
                                    {/* ================= MOBILE ================= */}
                                    <div className="lg:hidden">
                                        {programLessons.length > 1 ? (
                                            <CarouselWithIndicators itemClassName="basis-[85%]">
                                                {programLessons.map((lesson) => (
                                                    <LessonCard
                                                        key={lesson.id}
                                                        locale={locale}
                                                        programSlug={program.slug}
                                                        lesson={lesson}
                                                    />
                                                ))}
                                            </CarouselWithIndicators>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-6">
                                                {programLessons.map((lesson) => (
                                                    <LessonCard
                                                        key={lesson.id}
                                                        locale={locale}
                                                        programSlug={program.slug}
                                                        lesson={lesson}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* ================= DESKTOP ================= */}
                                    <div className="hidden lg:block">
                                        {programLessons.length > 3 ? (
                                            <CarouselWithIndicators itemClassName="basis-1/3">
                                                {programLessons.map((lesson) => (
                                                    <LessonCard
                                                        key={lesson.id}
                                                        locale={locale}
                                                        programSlug={program.slug}
                                                        lesson={lesson}
                                                    />
                                                ))}
                                            </CarouselWithIndicators>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-6">
                                                {programLessons.map((lesson) => (
                                                    <LessonCard
                                                        key={lesson.id}
                                                        locale={locale}
                                                        programSlug={program.slug}
                                                        lesson={lesson}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                     {t('noLessons')}
                                </p>
                            )}
                        </section>
                    )
                })}
            </section>
        </main>
    )
}

async function LessonCard({
    locale,
    programSlug,
    lesson,
}: {
    locale: Locale
    programSlug: string
    lesson: Lesson
}) {
    const href = `/${locale}/programi/${programSlug}/${lesson.slug}`
    const comingSoon = lesson.comingSoon === 'yes'

    return (
        <Link
            href={href}
            className="block w-full group rounded-xl bg-[#F8F8F8] p-2 ring-1 ring-black/5 overflow-hidden"
        >
            <div className="relative">
                <div className="relative aspect-[16/10] bg-black/5 overflow-hidden rounded-[10px]">
                    {lesson.media && typeof lesson.media === 'object' && (
                        <Media
                            resource={lesson.media}
                            imgClassName="object-cover"
                            videoClassName="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Arrow */}
                <div className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm ring-1 ring-black/5">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        className="text-black/80"
                        fill="none"
                    >
                        <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" />
                        <path
                            d="M9 7H17V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Coming soon */}
                {comingSoon && (
                    <div className="absolute right-3 bottom-3">
                        <span className="inline-flex rounded-full bg-[#B7FF96] px-3 py-1 text-xs font-medium">
                            Prihaja kmalu
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <p className="text-base font-semibold leading-snug">
                    {lesson.title}
                </p>

                 {lesson.description && (
                    <div className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        <RichText data={lesson.description} enableGutter={false} />
                    </div>
                )}
                
            </div>
        </Link>
    )
}
