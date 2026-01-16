'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { DefaultDocumentIDType } from 'payload'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { RichText } from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'
import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'

import { CMSLink } from '@/components/Link'
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'

export type Value = unknown
export interface Property {
  [key: string]: Value
}
export interface Data {
  [key: string]: Property | Property[]
}

type ContactInfo = {
  email?: string
  phone?: string
  facebookLabel?: string
  facebookUrl?: string
  instagramLabel?: string
  instagramUrl?: string
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  form: FormType
  title: string
  description?: SerializedEditorState
  contactInfo?: ContactInfo
}

export const FormBlock: React.FC<
  FormBlockType & {
    id?: DefaultDocumentIDType
  }
> = (props) => {
  const t = useTranslations('FormBlock')
  const locale = useLocale() // ✅ add

  const {
    form: formFromProps,
    form: { id: formID, confirmationType, redirect, submitButtonLabel } = {},
    title,
    description,
    contactInfo,
  } = props

  const defaultValues = useMemo(
    () => buildInitialFormState(formFromProps.fields),
    [formFromProps.fields],
  )

  const formMethods = useForm({ defaultValues })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [toast, setToast] = useState<string | null>(null)
  const [errorText, setErrorText] = useState<string | null>(null)

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>

      const submitForm = async () => {
        setErrorText(null)
        setToast(null)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
              locale, // ✅ add
            }),
            headers: {
              'Content-Type': 'application/json',
              'Accept-Language': locale, // ✅ add
            },
            method: 'POST',
          })

          const res = await req.json().catch(() => ({}))

          clearTimeout(loadingTimerID)
          setIsLoading(false)

          if (req.status >= 400) {
            setErrorText(res.errors?.[0]?.message || t('errors.generic'))
            return
          }

          setToast(t('toasts.success'))
          reset(defaultValues)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          clearTimeout(loadingTimerID)
          setIsLoading(false)
          setErrorText(t('errors.generic'))
        }
      }

      void submitForm()
    },
    [formID, confirmationType, redirect, router, reset, defaultValues, t, locale],
  )

  return (
    <div className="container py-12 md:py-20 lg:py-28">
      <div className="relative rounded-xl bg-kournikova-light px-8 py-8 lg:px-16 lg:py-16 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <h2 className="text-5xl lg:text-6xl font-semibold tracking-tight">
            {title || t('left.fallbackTitle')}
          </h2>

          {description && <RichText data={description} enableGutter={false} className="text-xl" />}

          {contactInfo && (
            <div className="space-y-4 text-base">
              {contactInfo.email && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
                    <Mail />
                  </span>
                  <a href={`mailto:${contactInfo.email}`} className="underline-offset-2 hover:underline text-xl">
                    {contactInfo.email}
                  </a>
                </div>
              )}

              {contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
                    <Phone />
                  </span>
                  <a href={`tel:${contactInfo.phone}`} className="underline-offset-2 hover:underline text-xl">
                    {contactInfo.phone}
                  </a>
                </div>
              )}

              {(contactInfo.facebookLabel || contactInfo.facebookUrl) && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
                    <Facebook />
                  </span>
                  <a
                    href={contactInfo.facebookUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-2 hover:underline text-xl"
                  >
                    {contactInfo.facebookLabel || t('left.facebookFallback')}
                  </a>
                </div>
              )}

              {(contactInfo.instagramLabel || contactInfo.instagramUrl) && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
                    <Instagram />
                  </span>
                  <a
                    href={contactInfo.instagramUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-2 hover:underline text-xl"
                  >
                    {contactInfo.instagramLabel || t('left.instagramFallback')}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE – form */}
        <div className="rounded-[10px] md:py-6">
          <FormProvider {...formMethods}>
            <form
              id={formID}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 [&_input]:h-12 [&_input]:text-base [&_textarea]:min-h-[140px] [&_textarea]:text-base"
            >
              <div className="space-y-6">
                {formFromProps?.fields?.map((field, index) => {
                  const Field: React.FC<any> | undefined = fields?.[field.blockType as keyof typeof fields]
                  if (!Field) return null

                  return (
                    <div key={index}>
                      <Field
                        form={formFromProps}
                        {...field}
                        {...formMethods}
                        control={control}
                        errors={errors}
                        register={register}
                        disabled={isLoading}
                      />
                    </div>
                  )
                })}
              </div>

              <CMSLink
                type="custom"
                url="#"
                appearance="rumen"
                className="inline-flex w-auto max-w-max self-start mt-2 flex items-center gap-1 sm:mt-0"
                onClick={(e) => {
                  e.preventDefault()
                  if (!formID) return
                  const formEl = document.getElementById(String(formID)) as HTMLFormElement | null
                  formEl?.requestSubmit()
                }}
              >
                {isLoading ? t('button.loading') : submitButtonLabel || t('button.default')}
              </CMSLink>
            </form>

            {toast && <div className="my-2 text-md text-foreground font-semibold">{toast}</div>}
            {errorText && <p className="my-2 text-xs text-red-600">{errorText}</p>}
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
