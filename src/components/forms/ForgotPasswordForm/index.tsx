'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'


type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const t = useTranslations('ForgotPasswordForm')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
        {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      )

      if (response.ok) {
        setSuccess(true)
        setError('')
      } else {
        setError(t('errorSendFailed'))
      }
    },
    [t],
  )

  return (
    <Fragment>
      {!success && (
        <Fragment>
          <h1 className="text-xl mb-4">{t('title')}</h1>

          <div className="prose dark:prose-invert mb-8">
            <p>
              {t('intro')}{' '}
              {/* admin stays without locale, since it’s a separate app */}
              <Link href="/admin/collections/users" locale={false}>
                {t('adminLinkText')}
              </Link>
              .
            </p>
          </div>

          <form className="max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <Message className="mb-8" error={error} />

            <FormItem className="mb-8">
              <Label htmlFor="email" className="mb-2">
                {t('emailLabel')}
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: t('emailRequired'),
                })}
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <Button type="submit" variant="default">
              {t('submit')}
            </Button>
          </form>
        </Fragment>
      )}

      {success && (
        <Fragment>
          <h1 className="text-xl mb-4">{t('successTitle')}</h1>
          <div className="prose dark:prose-invert">
            <p>{t('successText')}</p>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}
