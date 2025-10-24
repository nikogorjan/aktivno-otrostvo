'use client'

import leafAnimation from '@/../public/lottie/green-leaf.json'
import { Media } from '@/components/Media'
import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import * as React from 'react'

export const TestimonialsBlock: React.FC<TestimonialsBlockProps & { className?: string }> = ({
  heading,
  description,
  items = [],
  className,
}) => {
  const lottieRef = React.useRef<LottieRefCurrentProps>(null)
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [index, setIndex] = React.useState(0)
  const count = items.length

  // --- helpers ---------------------------------------------------------------

  // Set Lottie speed once
  React.useEffect(() => {
    lottieRef.current?.setSpeed(0.3)
  }, [])

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current
    if (!el) return
    const child = el.children[i] as HTMLElement | undefined
    if (!child) return

    const elRect = el.getBoundingClientRect()
    const childRect = child.getBoundingClientRect()
    const deltaLeft = childRect.left - elRect.left
    const target = el.scrollLeft + deltaLeft

    el.scrollTo({ left: target, behavior: 'smooth' })
    setIndex(i)
  }

  const prev = () => scrollToIndex((index - 1 + count) % count)
  const next = () => scrollToIndex((index + 1) % count)

  // Keep dots in sync with the nearest centered slide
  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let rafId = 0
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const elRect = el.getBoundingClientRect()
        const centerX = elRect.left + elRect.width / 2
        let nearest = 0
        let best = Infinity

        for (let i = 0; i < el.children.length; i++) {
          const child = el.children[i] as HTMLElement
          const rect = child.getBoundingClientRect()
          const childCenterX = rect.left + rect.width / 2
          const dist = Math.abs(childCenterX - centerX)
          if (dist < best) {
            best = dist
            nearest = i
          }
        }

        setIndex((prev) => (prev === nearest ? prev : nearest))
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      el.removeEventListener('scroll', onScroll)
    }
  }, [])

  // ✅ Only now is it safe to early-return; hooks above always run in the same order
  if (!count) return null

  return (
    <section className={cn('py-16 md:py-24 lg:py-28', className)}>
      <div className="container">
        <div className="grid auto-cols-fr grid-cols-1 items-start gap-12 md:gap-16 lg:grid-cols-2 lg:gap-0">
          {/* Left: heading + description */}
          <div className="flex lg:justify-self-end">
            <div className="w-full max-w-2xl lg:mb-24 lg:mr-20">
              <div className="relative">
                <div className="absolute -top-12 -right-4 w-20 h-20 pointer-events-none rotate-20">
                  <Lottie lottieRef={lottieRef} animationData={leafAnimation} loop autoplay />
                </div>
              </div>
              {heading && (
                <h2 className="mb-5 text-4xl md:text-5xl font-medium leading-tight">{heading}</h2>
              )}
              {description && <p className="text-lg text-muted-foreground">{description}</p>}
            </div>
          </div>

          {/* Right: carousel */}
          <div className="overflow-hidden lg:px-0">
            <div
              ref={scrollerRef}
              className={cn(
                'flex snap-x snap-mandatory overflow-x-auto scroll-smooth gap-0',
                'ml-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              )}
            >
              {items.map((t, i) => (
                <article
                  key={i}
                  className={cn(
                    'snap-start shrink-0 [scroll-snap-stop:always]',
                    'basis-[95%] sm:basis-[80%] md:basis-[60%]',
                    'mr-6 md:mr-8',
                  )}
                >
                  <TestimonialCard
                    stars={t.numberOfStars ?? 0}
                    quote={t.quote || ''}
                    avatar={t.avatar}
                    name={t.name || ''}
                    subtitle={t.subtitle || ''}
                  />
                </article>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-12 flex items-center justify-between relative">
              <div className="flex gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  className="size-12 cursor-pointer rounded-full border border-border bg-card grid place-items-center hover:bg-muted transition"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  className="size-12 cursor-pointer rounded-full border border-border bg-card grid place-items-center hover:bg-muted transition"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>

              {/* Dots */}
              <div className="absolute right-[5%] md:right-8 lg:right-16 mt-5 flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => scrollToIndex(i)}
                    className={cn(
                      'size-2 rounded-full transition-colors',
                      i === index ? 'bg-foreground' : 'bg-muted',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  stars,
  quote,
  avatar,
  name,
  subtitle,
}: {
  stars: number
  quote: string
  avatar: TestimonialsBlockProps['items'][number]['avatar'] // ✅ no `any`
  name: string
  subtitle?: string
}) {
  const count = Math.max(0, Math.min(5, stars || 0))
  return (
    <div className="w-full h-full rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
      {/* Stars */}
      <div className="mb-5 md:mb-6 flex text-kournikova">
        {Array.from({ length: count }).map((_, i) => (
          <Star key={i} className="size-5 fill-current" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-base leading-relaxed">{quote}</blockquote>

      {/* Author */}
      <div className="mt-6 md:mt-7 flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
          {avatar && <Media resource={avatar} imgClassName="object-cover" />}
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
