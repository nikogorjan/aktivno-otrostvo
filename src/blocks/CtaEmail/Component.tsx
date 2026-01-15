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
    mailerLite,
  } = props

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // If action is provided, allow native POST behavior
    if (action) return

    e.preventDefault()
    setError(null)
    setToast(null)

    if (!mailerLite?.enabled) return

    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot check
    if (honeypotName && data.get(honeypotName)) return

    const email = data.get('email')
    if (!email || typeof email !== 'string') return

    // MailerLite config sanity
    if (!mailerLite.groupId) {
      setError('Manjka MailerLite Group ID.')
      return
    }

    setLoading(true)

    let res: Response
    try {
      res = await fetch('/api/marketing/subscribe-mailerlite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          groupId: mailerLite.groupId,
          doubleOptIn: mailerLite.doubleOptIn,
        }),
      })
    } catch (err) {
      setLoading(false)
      setError('Prišlo je do napake. Poskusite znova.')
      return
    }

    setLoading(false)

    const json: any = await res.json().catch(() => ({}))

    // Handle "already subscribed" even if server returns non-2xx
    if (!res.ok) {
      if (json?.code === 'already_subscribed') {
        console.log('Already subscribed:', email)
        setToast('Ta e-naslov je že prijavljen.')
        return
      }

      console.log('Subscribe error:', json)
      setError('Prišlo je do napake. Poskusite znova.')
      return
    }

    // Success cases
    if (json?.code === 'already_subscribed') {
      console.log('Already subscribed:', email)
      setToast('Ta e-naslov je že prijavljen.')
    } else if (json?.code === 'pending_confirmation') {
      setToast('Hvala! Preverite e-pošto in potrdite prijavo.')
    } else {
      setToast('Hvala! Uspešno ste se prijavili.')
    }

    // Redirect only if it's set and not "#"
    if (successRedirect && successRedirect !== '#') {
      window.location.href = successRedirect
    }
  }

  return (
    <section className={cn('py-12 md:py-20 lg:py-28', className)}>
      <div className="container">
        {/* Inner wrapper with background */}
        <div className="relative overflow-hidden rounded-2xl  bg-kournikova-light p-3">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* LEFT IMAGE */}
            <div className="relative w-full h-72 md:h-[420px] rounded-xl overflow-hidden  bg-card">
              {image && typeof image === 'object' ? (
                <Media resource={image} fill imgClassName="object-cover" priority />
              ) : (
                <Image src="/images/placeholder.jpg" alt="CTA" fill className="object-cover" priority />
              )}
            </div>

            {/* RIGHT CONTENT */}
            <div className="relative z-10">
              <div className="max-w-xl">
                {heading && (
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {heading}
                  </h2>
                )}
                {description && <p className="text-foreground mb-6">{description}</p>}

                {/* EMAIL FORM */}
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

                  {/* Same visual component; prevents navigation in MailerLite mode */}
                  <CMSLink
                    type="custom"
                    url="#"
                    appearance="rumen"
                    className="self-start mt-2 flex items-center gap-1 sm:mt-0 sm:ml-3"
                    onClick={(e) => {
                      // Only intercept when we handle submit ourselves
                      if (!action) {
                        e.preventDefault()
                        e.stopPropagation()
                        const formEl = e.currentTarget.closest('form') as HTMLFormElement | null
                        formEl?.requestSubmit()
                      }
                    }}
                  >
                    {loading ? '...' : buttonLabel ?? 'Prijava'}
                  </CMSLink>

                  {successRedirect ? (
                    <input type="hidden" name="successRedirect" value={successRedirect} />
                  ) : null}
                </form>

                {toast && <div className="mb-2 text-md text-foreground font-semibold">{toast}</div>}
                {error && <p className="text-xs text-red-600">{error}</p>}
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
