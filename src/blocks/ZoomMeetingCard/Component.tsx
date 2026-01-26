'use client'

import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { ZoomMeetingCardBlock as ZoomMeetingCardBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'

import { buildInitialFormState } from '@/blocks/Form/buildInitialFormState'
import { fields } from '@/blocks/Form/fields'

type FormValues = Record<string, any>

export const ZoomMeetingCardBlock: React.FC<ZoomMeetingCardBlockProps & { className?: string }> = (props) => {
  const {
    form: formFromProps,
    image,
    heading,
    description,
    zoomLink,
    buttonLabel,
    honeypotName,
    terms,
    showDecoration = true,
    className,
  } = props

  const locale = useLocale()
  const t = useTranslations('FormBlock')

  const formID =
    typeof formFromProps === 'object' && formFromProps !== null ? (formFromProps as any).id : formFromProps

  const formFields =
    typeof formFromProps === 'object' && formFromProps !== null ? (formFromProps as any).fields : undefined

  const defaultValues = React.useMemo(
    () => (formFields ? buildInitialFormState(formFields) : {}),
    [formFields],
  )

  const formMethods = useForm<FormValues>({ defaultValues })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = formMethods

  const [loading, setLoading] = React.useState(false)
  const [toast, setToast] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const termsEnabled = terms?.enabled ?? true
  const termsRequired = terms?.required ?? true
  const termsLabel = terms?.label ?? 'Strinjam se s pogoji'
  const termsFieldName = '__terms'

  const onSubmit = async (data: FormValues) => {
    setError(null)
    setToast(null)

    if (!formID) {
      setError('Missing form')
      return
    }

    const link = typeof zoomLink === 'string' ? zoomLink.trim() : ''
    if (!link) {
      setError('Missing Zoom link (admin)')
      return
    }

    if (honeypotName && data?.[honeypotName]) return

    if (termsEnabled && termsRequired && !data?.[termsFieldName]) {
      setError(termsLabel)
      return
    }

    const submissionData = Object.entries(data)
      .filter(([k]) => k !== honeypotName && k !== termsFieldName)
      .map(([field, value]) => ({ field, value }))

    setLoading(true)

    try {
      const res = await fetch('/api/marketing/zoom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          formId: formID,
          submissionData,
          zoomLink: link, // ✅ injected server-side into submissionData as "zoomLink"
        }),
      })

      const json: any = await res.json().catch(() => ({}))
      setLoading(false)

      if (!res.ok) {
        if (json?.code === 'missing_zoom_link') {
          setError('Missing Zoom link (admin)')
        } else {
          setError(t('errors.generic'))
        }
        return
      }

      setToast(t('toasts.success'))
      reset(defaultValues)
    } catch {
      setLoading(false)
      setError(t('errors.generic'))
    }
  }

  return (
    <section className={cn('py-12 md:py-20 lg:py-28 bg-[#FBFBFB]', className)}>
      <div className="container">
        <div className="relative overflow-hidden rounded-[32px] bg-modra-hover p-3">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-center">
            {/* LEFT IMAGE */}
            <div className="relative w-full h-180 md:h-full rounded-[28px] overflow-hidden bg-card">
              {image && typeof image === 'object' ? (
                <Media resource={image} fill imgClassName="object-cover" priority />
              ) : (
                <Image src="/images/placeholder.jpg" alt="" fill className="object-cover" priority />
              )}
            </div>

            {/* RIGHT */}
            <div className="relative z-10">
              <div className="w-full md:w-[90%] md:py-2">
                {heading ? (
                  <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
                    {heading}
                  </h2>
                ) : null}

                {description ? <p className="text-foreground/80 mb-8">{description}</p> : null}

                <FormProvider {...formMethods}>
                  <form className="flex flex-col w-full max-w-2xl space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {honeypotName ? (
                      <input
                        type="text"
                        {...register(honeypotName as string)}
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                      />
                    ) : null}

                    <div className="space-y-5">
                      {(formFields || []).map((field: any, index: number) => {
                        const Field = fields?.[field.blockType as keyof typeof fields] as React.FC<any> | undefined
                        if (!Field) return null

                        return (
                          <div key={index} >
                            <Field
                              form={formFromProps as any}
                              {...field}
                              {...formMethods}
                              control={control}
                              errors={errors}
                              register={register}
                              disabled={loading}
                              variant="card"
                            />
                          </div>
                        )
                      })}
                    </div>

                    {termsEnabled ? (
                      <label className="flex items-center gap-3 text-foreground">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-foreground/20"
                          {...register(termsFieldName)}
                          disabled={loading}
                        />
                        <span className="text-sm md:text-base">{termsLabel}</span>
                      </label>
                    ) : null}

                    <div className="pt-1">
                      <CMSLink
                        type="custom"
                        url="#"
                        appearance="moder"
                        className="inline-flex items-center gap-2 rounded-full"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const formEl = e.currentTarget.closest('form') as HTMLFormElement | null
                          formEl?.requestSubmit()
                        }}
                      >
                        {loading ? t('button.loading') : buttonLabel || t('button.default')}
                    
                      </CMSLink>
                    </div>
                  </form>
                </FormProvider>

                {toast ? <div className="mt-4 text-md text-foreground font-semibold">{toast}</div> : null}
                {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
              </div>
            </div>
          </div>

          {showDecoration ? (
            <Image
              src="https://bloom42-media.s3.eu-central-1.amazonaws.com/blue-ball.svg"
              width={180}
              height={180}
              alt=""
              className="pointer-events-none select-none absolute -bottom-10 -right-10 sm:right-10 w-44 h-44 opacity-90 z-0"
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
