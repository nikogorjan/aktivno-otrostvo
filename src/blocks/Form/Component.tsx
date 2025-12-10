// src/blocks/FormBlock/Component.tsx
'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { DefaultDocumentIDType } from 'payload'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { RichText } from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'
import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'

// material icons (you may already have react-icons installed;
// if not, install: pnpm add react-icons)
import { CMSLink } from '@/components/Link'
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'
import Image from 'next/image'

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
  const {
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    title,
    description,
    contactInfo,
  } = props

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>

      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Prišlo je do napake.',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Nekaj je šlo narobe.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="container py-12 md:py-20 lg:py-28">
      <div className="relative rounded-xl bg-kournikova-light px-8 py-8 lg:px-16 lg:py-16 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
        {/* LEFT SIDE – text + contact info */}
        <div className="space-y-6">
          {/* Naslov */}
          <h2 className="text-5xl lg:text-6xl font-semibold tracking-tight">
            {title || 'Kontaktirajte nas'}
          </h2>

          {/* Opis */}
          {description && (
            <RichText data={description} enableGutter={false} className="text-xl" />
          )}

          {/* Kontaktni podatki */}
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
                    {contactInfo.facebookLabel || 'Facebook'}
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
                    {contactInfo.instagramLabel || 'Instagram'}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE – form */}
        <div className="rounded-[10px] md:py-6">
          <FormProvider {...formMethods}>
            {!isLoading && hasSubmitted && confirmationType === 'message' && (
              <RichText data={confirmationMessage} />
            )}

            {isLoading && !hasSubmitted && <p>Nalaganje, prosimo počakajte…</p>}

            {error && (
              <div className="mb-4 text-sm text-red-700">
                {`${error.status || '500'}: ${error.message || ''}`}
              </div>
            )}

            {!hasSubmitted && (
              <form id={formID} onSubmit={handleSubmit(onSubmit)} className="space-y-6 [&_input]:h-12 [&_input]:text-base [&_textarea]:min-h-[140px] [&_textarea]:text-base">
                <div className="space-y-6">
                  {formFromProps?.fields?.map((field, index) => {
                    const Field: React.FC<any> | undefined =
                      fields?.[field.blockType as keyof typeof fields]

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
                  {submitButtonLabel || 'Pošlji'}
                </CMSLink>
              </form>
            )}
          </FormProvider>
        </div>
        <Image
          src="https://bloom42-media.s3.eu-central-1.amazonaws.com/yellowball.svg"
          width={160}
          height={160}
          alt=""
          className="pointer-events-none select-none absolute bottom-0 right-12 sm:right-12 w-40 h-40 opacity-90 z-[0]"
        />
      </div>
    </div>
  )
}
