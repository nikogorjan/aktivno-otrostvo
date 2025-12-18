'use client'

import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/utilities/cn'
import * as React from 'react'

type Props = {
  children: React.ReactNode[]
  itemClassName?: string
}

export function CarouselWithIndicators({ children, itemClassName }: Props) {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [selected, setSelected] = React.useState(0)
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)

  React.useEffect(() => {
    if (!api) return

    const update = () => {
      setSelected(api.selectedScrollSnap())
      setCanPrev(api.canScrollPrev())
      setCanNext(api.canScrollNext())
    }

    update()
    api.on('select', update)
    api.on('reInit', update)

    return () => {
      api.off('select', update)
      api.off('reInit', update)
    }
  }, [api])

  const scrollPrev = () => api?.scrollPrev()
  const scrollNext = () => api?.scrollNext()

  return (
    <div>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {children.map((child, index) => (
            <CarouselItem key={index} className={itemClassName}>
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* ✅ ONE ROW: indicators left, arrows right */}
      {children.length > 1 && (
        <div className="mt-3 flex items-center">
          {/* Indicators LEFT */}
          <div className="flex items-center gap-2">
            {children.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  selected === index ? 'bg-black' : 'bg-black/30 hover:bg-black/50',
                )}
                aria-label={`Pojdi na diapozitiv ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex-1" />

          {/* Arrows RIGHT */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition cursor-pointer',
                !canPrev && 'opacity-40 cursor-not-allowed',
              )}
              aria-label="Prejšnji"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition cursor-pointer',
                !canNext && 'opacity-40 cursor-not-allowed',
              )}
              aria-label="Naslednji"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
