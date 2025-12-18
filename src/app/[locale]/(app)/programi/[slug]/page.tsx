import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { CarouselWithIndicators } from '@/components/ui/carousel-indicators'
import type { Lesson, ProgramCategory } from '@/payload-types'
import { cn } from '@/utilities/cn'

type Locale = 'sl' | 'en'

type PageParams = {
    slug: string
    locale: Locale
}

type PageProps = {
    params: Promise<PageParams>
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

export default async function ProgramPage({ params }: PageProps) {
    const { slug, locale } = await params

    const program = await queryProgramBySlug({ slug, locale })
    if (!program) return notFound()

    const lessons = await queryLessonsByProgram({ programId: program.id, locale })

    const bgClass =
        BG_COLOR_MAP[(program.backgroundColor as string) || 'modra'] ?? BG_COLOR_MAP.modra

    return (
        <main className="bg-[#FBFBFB]">
            {/* Title row */}
            <section className="container pt-10 md:pt-14 lg:pt-16">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr] lg:gap-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                        {program.title}
                    </h1>
                    <div />
                </div>
            </section>

            {/* Hero media inside colored block */}
            <section className="container mt-6 md:mt-8 lg:mt-10">
                <div className={cn('rounded-xl p-5 md:p-8 lg:p-10', bgClass)}>
                    <div className="relative w-full overflow-hidden rounded-[10px] bg-black/5 aspect-[16/9]">
                        {program.media && typeof program.media === 'object' && (
                            <Media
                                resource={program.media}
                                imgClassName="object-cover"
                                videoClassName="w-full h-full object-cover"
                                videoControls
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Rich text content */}
            <section className="container py-10 md:py-12 lg:py-14">
                <div className="max-w-4xl">
                    {program.description && (
                        <div className="prose max-w-none">
                            <RichText data={program.description} enableGutter={false} />
                        </div>
                    )}
                </div>

                {/* Lessons grid */}
                {lessons.length > 0 && (
  <div className="mt-10 md:mt-12">
    {/* ================= MOBILE ================= */}
    <div className="lg:hidden">
      {lessons.length > 1 ? (
        <CarouselWithIndicators itemClassName="basis-[85%]">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              locale={locale}
              programSlug={programSlugValue(program, locale)}
              lesson={lesson}
            />
          ))}
        </CarouselWithIndicators>
      ) : (
        <LessonCard
          locale={locale}
          programSlug={programSlugValue(program, locale)}
          lesson={lessons[0]}
        />
      )}
    </div>

    {/* ================= DESKTOP ================= */}
    <div className="hidden lg:block">
      {lessons.length > 3 ? (
        <CarouselWithIndicators itemClassName="basis-1/3">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              locale={locale}
              programSlug={programSlugValue(program, locale)}
              lesson={lesson}
            />
          ))}
        </CarouselWithIndicators>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              locale={locale}
              programSlug={programSlugValue(program, locale)}
              lesson={lesson}
            />
          ))}
        </div>
      )}
    </div>
  </div>
)}
            </section>
        </main>
    )
}

/**
 * If your program slug is localized via slugField, it might be either:
 * - string
 * - { sl: string, en: string }
 * This helper keeps URL building safe.
 */
function programSlugValue(program: any, locale: Locale) {
    const raw = program.slug
    return typeof raw === 'string' ? raw : raw?.[locale] ?? raw?.sl
}

function LessonCard({
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
                            videoClassName="w-full h-full object-cover rounded-[10px]"
                        />
                    )}
                </div>

                {/* Arrow icon top-right */}
                <div className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm ring-1 ring-black/5">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        className="text-black/80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path
                            d="M9 7H17V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Coming soon pill */}
                {comingSoon && (
                    <div className="absolute right-3 bottom-3">
                        <span className="inline-flex items-center rounded-full bg-[#B7FF96] px-3 py-1 text-xs font-medium text-black/80">
                            Prihaja kmalu
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <p className="text-base font-semibold leading-snug">{lesson.title}</p>
            </div>
        </Link>
    )
}

const queryProgramBySlug = async ({ slug, locale }: { slug: string; locale: Locale }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'programCategories',
    limit: 1,
    pagination: false,
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  return (result.docs?.[0] as ProgramCategory | undefined) || null
}

const queryLessonsByProgram = async ({
  programId,
  locale,
}: {
  programId: string
  locale: Locale
}) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'lessons',
    pagination: false,
    locale,
    depth: 2,
    limit: 100,
    where: {
      program: {
        equals: programId,
      },
    },
  })

  return (result.docs as Lesson[]) || []
}