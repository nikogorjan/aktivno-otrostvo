// src/blocks/RoadmapSectionBlock.tsx
'use client'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { cn } from '@/utilities/cn'
import { MotionValue, motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import * as React from 'react'

// --- LOCAL TYPES (match your block config) -----------------------------

type RoadmapItem = {
  color?: 'roza' | 'modra' | 'rumena' | string
  title?: string | null
  description?: any
  image?: any
}

type RoadmapSectionBlockProps = {
  heading?: string | null
  description?: any
  items?: RoadmapItem[]
  className?: string
  // Payload will also pass blockType, id, etc. – they are fine to ignore.
}

// --- STYLES ------------------------------------------------------------

const CARD_COLORS: Record<string, string> = {
  roza: 'bg-roza-hover',
  modra: 'bg-modra-hover',
  rumena: 'bg-rumena-hover',
}

const BADGE_COLORS: Record<string, string> = {
  roza: 'bg-roza text-foreground',
  modra: 'bg-modra text-foreground',
  rumena: 'bg-rumena text-foreground',
}

// Simple media query hook (same idea as Relume)
function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    if (mq.addEventListener) mq.addEventListener('change', update)
    else mq.addListener(update)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update)
      else mq.removeListener(update)
    }
  }, [query])

  return matches
}

// --- Relume-style animation logic -------------------------------------

const calculateScales = (totalSections: number, scrollYProgress: MotionValue<number>) => {
  return Array.from({ length: totalSections }, (_, index) => {
    const sectionFraction = 1 / totalSections
    const start = sectionFraction * index
    const end = sectionFraction * (index + 1)

    return index < totalSections - 1
      ? useTransform(scrollYProgress, [start, end], [1, 0.8])
      : useMotionValue(1)
  })
}

// --- MAIN SECTION ------------------------------------------------------

export const RoadmapSectionBlock: React.FC<RoadmapSectionBlockProps> = ({
  heading,
  description,
  items = [],
  className,
}) => {
  if (!items.length) return null

  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end 60%'],
  })

  const scales = calculateScales(items.length, scrollYProgress)

  return (
    <section className={cn('py-12 md:py-20 lg:py-24', className)}>
      {/* Heading + intro */}
      <div className="container max-w-3xl text-center">
        {heading && (
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">{heading}</h2>
        )}

        {description && (
          <div className="mt-4 text-base md:text-lg text-muted-foreground">
            <RichText data={description} enableGutter={false} />
          </div>
        )}
      </div>

      <div className="container mt-10 md:mt-14 lg:mt-16">
        {/* Scroll target, same pattern as Relume Layout408 */}
        <div ref={containerRef} className="grid grid-cols-1 gap-6 md:gap-0">
          {items.map((item, index) => (
            <RoadmapItemCard key={index} item={item} index={index} scale={scales[index]} />
          ))}
        </div>
      </div>
    </section>
  )
}

// --- SINGLE CARD -------------------------------------------------------

const RoadmapItemCard: React.FC<{
  item: RoadmapItem
  index: number
  scale: MotionValue<number>
}> = ({ item, index, scale }) => {
  const isMobile = useMediaQuery('(max-width: 767px)')

  const cardColor = CARD_COLORS[item.color || 'roza'] ?? CARD_COLORS['roza']
  const badgeColor = BADGE_COLORS[item.color || 'roza'] ?? BADGE_COLORS['roza']

  const content = (
    <>
      {/* Text side */}
      <div className="flex flex-col justify-center space-y-4 md:space-y-6 p-6 md:p-8 lg:p-12">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex h-9 w-9 aspect-square items-center justify-center rounded-full text-sm font-semibold',
              badgeColor,
            )}
          >
            {(index + 1).toString().padStart(2, '0')}
          </span>
          {item.title && (
            <h3 className="text-xl md:text-2xl font-semibold leading-tight">{item.title}</h3>
          )}
        </div>
        {item.description && (
          <div className="text-sm md:text-base text-muted-foreground">
            <RichText data={item.description} enableGutter={false} />
          </div>
        )}
      </div>

      {/* Image side */}
      <div className="flex items-center justify-center px-6 pb-6 md:px-8 md:py-8 lg:px-12 lg:py-12">
        <div className="relative min-h-56 md:min-h-72 lg:min-h-80 w-full aspect-square overflow-hidden rounded-[10px]">
          {item.image && <Media resource={item.image} fill imgClassName="object-cover" />}
        </div>
      </div>
    </>
  )

  // Mobile: static cards
  if (isMobile) {
    return (
      <div className={cn('static grid grid-cols-1 overflow-hidden rounded-xl bg-card', cardColor)}>
        {content}
      </div>
    )
  }

  // Desktop: sticky + scaled like Relume, but natural height (no 80vh)
  return (
    <motion.div
      className={cn(
        'static grid grid-cols-1 overflow-hidden rounded-xl bg-card',
        'md:sticky md:top-[10%] md:mb-[10vh] md:grid-cols-[1.1fr_1.4fr]',
        cardColor,
      )}
      style={{ scale }}
    >
      {content}
    </motion.div>
  )
}
