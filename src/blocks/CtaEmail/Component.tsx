'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { CtaEmailBlock as CtaEmailBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

// reuse the same field renderer map you already use for FormBlock
import { buildInitialFormState } from '../Form/buildInitialFormState'
import { fields } from '../Form/fields'

type FormValues = Record<string, any>

export const CtaEmailBlock: React.FC<CtaEmailBlockProps & { className?: string }> = (props) => {
  const {
    form: formFromProps,
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

  const t = useTranslations('CtaEmail')
  const locale = useLocale()

  const formID =
    typeof formFromProps === 'object' && formFromProps !== null ? (formFromProps as any).id : formFromProps

  const formFields =
    typeof formFromProps === 'object' && formFromProps !== null ? (formFromProps as any).fields : undefined

  const defaultValues = React.useMemo(
    () => (formFields ? buildInitialFormState(formFields) : {}),
    [formFields],
  )

  const formMethods = useForm<FormValues>({
    defaultValues,
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = formMethods

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<string | null>(null)

  const onSubmit = async (data: FormValues) => {
    // If action is provided, allow native POST behavior
    if (action) return

    setError(null)
    setToast(null)

    if (!formID) {
      setError(t('errors.missingForm'))
      return
    }

    // Honeypot check
    if (honeypotName && data?.[honeypotName]) return

    // Convert submitted values to Payload submissionData format
    const submissionData = Object.entries(data)
      .filter(([key]) => key !== honeypotName)
      .map(([field, value]) => ({ field, value }))

    // Extract email for MailerLite (expects a field named "email")
    const emailValue = data?.email
    const email = typeof emailValue === 'string' ? emailValue : undefined

    if (mailerLite?.enabled && !email) {
      setError(t('errors.missingEmail'))
      return
    }

    setLoading(true)

    let res: Response
    try {
      res = await fetch('/api/marketing/subscribe-mailerlite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          formId: formID,
          submissionData,
          mailerLite: mailerLite?.enabled
            ? {
                enabled: true,
                groupId: mailerLite.groupId,
                doubleOptIn: mailerLite.doubleOptIn,
                email,
              }
            : { enabled: false, email },
        }),
      })
    } catch (err) {
      setLoading(false)
      setError(t('errors.generic'))
      return
    }

    setLoading(false)

    const json: any = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(t('errors.generic'))
      return
    }

    if (json?.code === 'already_subscribed') {
      setToast(t('toasts.alreadySubscribed'))
      // important: do not clear the form necessarily; but it’s ok either way.
      // We'll keep the typed data (no reset) so user can adjust.
    } else if (json?.code === 'pending_confirmation') {
      setToast(t('toasts.pendingConfirmation'))
      reset(defaultValues)
    } else {
      setToast(t('toasts.subscribed'))
      reset(defaultValues)
    }

    // Redirect only if it's set and not "#"
    if (successRedirect && successRedirect !== '#') {
      window.location.href = successRedirect
    }
  }

  return (
    <section className={cn('py-12 md:py-20 lg:py-28 ', className)}>
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
              <div className="w-full md:max-w-[90%]">
                {heading && (
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{heading}</h2>
                )}
                {description && <p className="text-foreground mb-6">{description}</p>}

                {/* EMAIL / FORM BUILDER FIELDS */}
                <FormProvider {...formMethods}>
                  <form
                    className="flex flex-col w-full max-w-md mb-2 space-y-4"
                    action={action || undefined}
                    method={action ? 'POST' : undefined}
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    {honeypotName ? (
                      <input
                        type="text"
                        {...register(honeypotName as string)}
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                      />
                    ) : null}

                    <div className="flex-1 w-full space-y-4">
                      {(formFields || []).map((field: any, index: number) => {
                        const Field = fields?.[field.blockType as keyof typeof fields] as React.FC<any> | undefined
                        if (!Field) return null

                        return (
                          <div key={index} className="w-full">
                            <Field
                              form={formFromProps as any}
                              {...field}
                              {...formMethods}
                              control={control}
                              errors={errors}
                              register={register}
                              // your field components can use this to switch to "CTA look"
                              variant="cta"
                              disabled={loading}
                              // only pass CTA placeholder to the email field, as you already do
                              inputPlaceholder={field.blockType === 'email' ? inputPlaceholder : undefined}
                            />
                          </div>
                        )
                      })}
                    </div>

                    {/* Button under all inputs */}
                    <CMSLink
                      type="custom"
                      url="#"
                      appearance="rumen"
                      className="self-start mt-2 flex items-center gap-1 sm:mt-0"
                      onClick={(e) => {
                        if (!action) {
                          e.preventDefault()
                          e.stopPropagation()
                          const formEl = e.currentTarget.closest('form') as HTMLFormElement | null
                          formEl?.requestSubmit()
                        }
                      }}
                    >
                      {loading ? t('button.loading') : buttonLabel ?? t('button.default')}
                    </CMSLink>

                    {successRedirect ? (
                      <input type="hidden" name="successRedirect" value={successRedirect} />
                    ) : null}
                  </form>
                </FormProvider>

                {/* CTA-style messages under the form */}
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
