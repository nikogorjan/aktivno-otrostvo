'use client'

import { RichText } from '@/components/RichText'
import type { FaqSectionBlock as FaqSectionBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import * as React from 'react'

export const FaqSectionBlock: React.FC<FaqSectionBlockProps & { className?: string }> = ({
  heading,
  intro,
  items = [],
  className,
}) => {
  const [open, setOpen] = React.useState<number | null>(0)
  if (!items.length) return null

  return (
    <section className={cn('py-10 md:py-16 lg:py-20', className)}>
      <div className="container">
        {heading && <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">{heading}</h2>}
        {intro && (
          <div className="mt-4 max-w-3xl text-muted-foreground">
            <RichText data={intro} enableGutter={false} />
          </div>
        )}

        <div className="mt-10 space-y-4 md:space-y-5">
          {items.map((item, i) => {
            const isOpen = open === i
            const panelId = `faq-panel-${i}`
            const btnId = `faq-button-${i}`

            return (
              <div key={i} className={cn('rounded-lg bg-card/80 px-4 py-2 md:px-6 md:py-3 ', '')}>
                <button
                  id={btnId}
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-4 text-left cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="flex-1 text-base md:text-lg font-medium">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 pt-1 md:pb-6 md:pt-1 text-foreground/80">
                        <RichText data={item.answer} enableGutter={false} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
