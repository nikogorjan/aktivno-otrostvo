'use client'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { TabsSectionBlock as TabsSectionBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { motion } from 'framer-motion'
import * as React from 'react'

const COLOR_BADGES: Record<string, string> = {
  roza: 'bg-roza text-roza-dark',
  rumena: 'bg-rumena text-rumena-dark',
  modra: 'bg-modra text-modra-dark',
  vijolicna: 'bg-vijolicna text-vijolicna-dark',
}

function useIsDesktop(query = '(min-width: 1024px)') {
  const [isDesktop, setIsDesktop] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia(query)
    setIsDesktop(mq.matches)
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    if (mq.addEventListener) mq.addEventListener('change', handleChange)
    else mq.addListener(handleChange)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handleChange)
      else mq.removeListener(handleChange)
    }
  }, [query])
  return isDesktop
}

export const TabsSectionBlock: React.FC<TabsSectionBlockProps & { className?: string }> = ({
  heading,
  intro,
  items = [],
  className,
}) => {
  const [active, setActive] = React.useState(0)
  const isDesktop = useIsDesktop()
  if (!items.length) return null

  return (
    <section className={cn('py-6 md:py-12 lg:py-16', className)}>
      <div className="container">
        {heading && <h2 className="text-4xl md:text-5xl font-medium tracking-tight">{heading}</h2>}
        {intro && (
          <div className="mt-4 max-w-3xl text-lg text-muted-foreground">
            <RichText data={intro} enableGutter={false} />
          </div>
        )}
      </div>

      <div className="container mt-12 overflow-hidden  rounded-lg lg:h-[500px]">
        <div className="flex flex-col lg:flex-row  h-full">
          {items.map((item, i) => {
            const isActive = i === active
            const color = COLOR_BADGES[item.color || 'roza'] ?? COLOR_BADGES.roza

            return (
              <motion.div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => setActive(i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActive(i)}
                className={cn(
                  'group relative flex flex-col lg:flex-row overflow-hidden border-border cursor-pointer',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
                  'lg:border-r last:lg:border-r-0 box-border min-w-0',
                  isActive ? 'border-b lg:border-b-0' : 'border-b-0',
                  'lg:border-r last:lg:border-r-0',
                  'box-border min-w-0',
                )}
                initial={
                  isDesktop
                    ? i === 0
                      ? { flexGrow: 1, flexBasis: '0px', flexShrink: 1 }
                      : { flexGrow: 0, flexBasis: '80px', flexShrink: 0 }
                    : { flexGrow: 1, flexBasis: 'auto', flexShrink: 1 }
                }
                animate={
                  isDesktop
                    ? isActive
                      ? { flexGrow: 1, flexBasis: '0px', flexShrink: 1 }
                      : { flexGrow: 0, flexBasis: '80px', flexShrink: 0 }
                    : { flexGrow: 1, flexBasis: 'auto', flexShrink: 1 }
                }
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* Rail (always 80px on desktop) */}
                <div
                  className={cn(
                    'relative flex h-16 items-center justify-start gap-4 border-b border-border  md:h-20',
                    'lg:h-full lg:w-[80px] lg:min-w-[80px] lg:max-w-[80px] lg:flex-col lg:justify-between lg:border-none lg:px-0',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold',
                      'lg:mt-5 lg:mx-auto',
                      color,
                    )}
                  >
                    {(i + 1).toString().padStart(2, '0')}
                  </span>

                  {/* Mobile label */}
                  <span className="text-base font-medium lg:hidden">
                    {item.horizontalLabel || item.verticalLabel}
                  </span>

                  {/* Desktop vertical label */}
                  <span className="hidden lg:block [writing-mode:vertical-rl] rotate-180 text-2xl font-medium text-foreground/80">
                    {item.verticalLabel}
                  </span>
                </div>

                {/* Desktop content (mount only when active) */}
                {isDesktop ? (
                  isActive ? (
                    <div className="lg:flex-1 h-full min-w-0">
                      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8 p-6 md:p-10 lg:p-12 h-full min-w-0">
                        <div className="flex flex-col justify-center min-w-0">
                          {item.title && (
                            <h3 className="text-3xl md:text-4xl font-medium mb-4">{item.title}</h3>
                          )}
                          {item.description && (
                            <div className="max-w-xl text-muted-foregroun">
                              <RichText data={item.description} enableGutter={false} />
                            </div>
                          )}
                        </div>
                        <div className="relative w-full h-full min-w-0">
                          <div className="relative w-full h-full overflow-hidden rounded-lg">
                            <Media resource={item.image} fill imgClassName="object-cover" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                ) : (
                  // Mobile accordion
                  <motion.div
                    initial={{ height: i === 0 ? 'auto' : 0 }}
                    animate={{ height: isActive ? 'auto' : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 py-8 md:px-10 md:pb-8">
                      {item.title && (
                        <h3 className="text-2xl md:text-3xl font-semibold mb-3">{item.title}</h3>
                      )}
                      {item.description && (
                        <div className="text-foreground/80">
                          <RichText data={item.description} enableGutter={false} />
                        </div>
                      )}
                      <div className="mt-6">
                        <div className="relative w-full overflow-hidden rounded-xl border border-border aspect-[16/9]">
                          <Media resource={item.image} fill imgClassName="object-cover" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
