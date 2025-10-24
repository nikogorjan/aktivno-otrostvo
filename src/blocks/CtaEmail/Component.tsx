'use client'

import { Media } from '@/components/Media'
import type { CtaEmailBlock as CtaEmailBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'

// import decorative svg

export const CtaEmailBlock: React.FC<CtaEmailBlockProps & { className?: string }> = (props) => {
  const {
    image,
    heading,
    description,
    inputPlaceholder,
    buttonLabel,
    legalNote,
    action,
    successRedirect,
    honeypotName,
    showDecoration = true,
    className,
  } = props

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!action) {
      e.preventDefault()
      const data = new FormData(e.currentTarget)
      console.log('CTA email submit:', Object.fromEntries(data))
    }
  }

  return (
    <section className={cn('py-8 md:py-10', className)}>
      <div className="container">
        {/* Inner wrapper with background */}
        <div className="relative overflow-hidden rounded-2xl  bg-kournikova-light px-4 py-8 md:px-8 md:py-10">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* LEFT IMAGE */}
            <div className="relative w-full h-72 md:h-[420px] rounded-xl overflow-hidden  bg-card">
              {image && typeof image === 'object' ? (
                <Media resource={image} fill imgClassName="object-cover" priority />
              ) : (
                <Image
                  src="/images/placeholder.jpg"
                  alt="CTA"
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* RIGHT CONTENT */}
            <div className="relative z-10">
              <div className="max-w-xl">
                {heading && (
                  <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                    {heading}
                  </h2>
                )}
                {description && <p className="text-foreground mb-6">{description}</p>}

                {/* EMAIL FORM */}
                <form
                  className="flex w-full max-w-md mb-2"
                  action={action || undefined}
                  method={action ? 'POST' : undefined}
                  onSubmit={onSubmit}
                >
                  {honeypotName ? (
                    <input
                      type="text"
                      name={honeypotName}
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                    />
                  ) : null}

                  <input
                    type="email"
                    name="email"
                    placeholder={inputPlaceholder ?? 'Vpiši e-naslov'}
                    required
                    className={cn(
                      'flex-1 rounded-full px-4 py-3',
                      'placeholder:text-muted-foreground text-foreground',
                      'bg-white/60',
                      'focus:outline-none focus:ring-2 focus:ring-accent',
                    )}
                  />
                  <button
                    type="submit"
                    className={cn(
                      'ml-3 px-6 py-3 rounded-full font-medium transition flex items-center gap-1',
                      'bg-kournikova-lightest text-foreground hover:brightness-105',
                    )}
                  >
                    {buttonLabel ?? 'Prijava'}
                    <ArrowUpRight className="size-4" />
                  </button>

                  {successRedirect ? (
                    <input type="hidden" name="successRedirect" value={successRedirect} />
                  ) : null}
                </form>

                {legalNote && <p className="text-xs text-foreground">{legalNote}</p>}
              </div>
            </div>
          </div>

          {/* Decorative SVG behind all content */}
          {showDecoration && (
            <Image
              src="https://bloom42-media.s3.eu-central-1.amazonaws.com/yellowball.svg"
              width={160}
              height={160}
              alt=""
              className="pointer-events-none select-none absolute -bottom-10 -right-12 sm:right-12 w-40 h-40 opacity-90 z-0"
            />
          )}
        </div>
      </div>
    </section>
  )
}
