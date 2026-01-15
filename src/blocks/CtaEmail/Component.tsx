'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { CtaEmailBlock as CtaEmailBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Image from 'next/image'
import * as React from 'react'

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
    mailerLite, // 👈 added (from block config)
  } = props

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!action) {
      e.preventDefault()
      setError(null)

      if (!mailerLite?.enabled) return

      const form = e.currentTarget
      const data = new FormData(form)

      // Honeypot check
      if (honeypotName && data.get(honeypotName)) return

      const email = data.get('email')
      if (!email || typeof email !== 'string') return

      setLoading(true)

      const res = await fetch('/api/marketing/subscribe-mailerlite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          groupId: mailerLite.groupId,
          doubleOptIn: mailerLite.doubleOptIn,
        }),
      })

      setLoading(false)

      if (!res.ok) {
        setError('Prišlo je do napake. Poskusite znova.')
        return
      }

      if (successRedirect) {
        window.location.href = successRedirect
      }
    }
  }

  return (
    <section className={cn('py-12 md:py-20 lg:py-28', className)}>
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl  bg-kournikova-light p-3">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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

            <div className="relative z-10">
              <div className="max-w-xl">
                {heading && (
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {heading}
                  </h2>
                )}
                {description && <p className="text-foreground mb-6">{description}</p>}

                <form
                  className="flex flex-col sm:flex-row w-full max-w-md mb-2"
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
                    placeholder={inputPlaceholder ?? ''}
                    required
                    disabled={loading}
                    className={cn(
                      'flex-1 rounded-full px-4 py-3',
                      'placeholder:text-muted-foreground text-foreground',
                      'bg-white/60',
                      'focus:outline-none focus:ring-2 focus:ring-accent',
                    )}
                  />

                  {/* 👇 same visual component, but triggers submit */}
                  <CMSLink
                    type="custom"
                    url="#"
                    appearance="rumen"
                    className="self-start mt-2 flex items-center gap-1 sm:mt-0 sm:ml-3"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const form = e.currentTarget.closest('form') as HTMLFormElement | null
                      form?.requestSubmit()
                    }}
                  >
                    {loading ? '...' : buttonLabel ?? 'Prijava'}
                  </CMSLink>

                  {successRedirect ? (
                    <input type="hidden" name="successRedirect" value={successRedirect} />
                  ) : null}
                </form>

                {error && <p className="text-xs text-red-600">{error}</p>}
                {legalNote && <p className="text-xs text-foreground">{legalNote}</p>}
              </div>
            </div>
          </div>

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
