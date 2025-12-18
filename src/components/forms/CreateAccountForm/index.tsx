'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const t = useTranslations('CreateAccountForm')

  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef('')
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        // Prefer server message if it exists, otherwise fallback to translated message
        const message = response.statusText || t('errors.createAccountFailed')
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => setLoading(true), 1000)

      try {
        await login(data)
        clearTimeout(timer)

        if (redirect) router.push(redirect)
        else
          router.push(
            `/account?success=${encodeURIComponent(t('success.accountCreated'))}`,
          )
      } catch (_) {
        clearTimeout(timer)
        setError(t('errors.invalidCredentials'))
      }
    },
    [login, router, searchParams, t],
  )

  return (
    <form className="max-w-lg py-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="prose dark:prose-invert mb-6">
        <p>
          <Link href="/admin/collections/users">{t('adminLinkText')}</Link>
        </p>
      </div>

      <Message error={error} />

      <div className="flex flex-col gap-8 mb-8">
        <FormItem>
          <Label htmlFor="email" className="mb-2">
            {t('emailLabel')}
          </Label>
          <Input
            id="email"
            {...register('email', { required: t('errors.emailRequired') })}
            type="email"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password" className="mb-2">
            {t('passwordLabel')}
          </Label>
          <Input
            id="password"
            {...register('password', { required: t('errors.passwordRequired') })}
            type="password"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="passwordConfirm" className="mb-2">
            {t('passwordConfirmLabel')}
          </Label>
          <Input
            id="passwordConfirm"
            {...register('passwordConfirm', {
              required: t('errors.passwordConfirmRequired'),
              validate: (value) => value === password.current || t('errors.passwordMismatch'),
            })}
            type="password"
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <Button disabled={loading} type="submit" variant="default">
        {loading ? t('processing') : t('submit')}
      </Button>

      <div className="prose dark:prose-invert mt-8">
        <p>
          {t('alreadyHaveAccount')}
          <Link href={`/login${allParams}`}>{t('loginLinkText')}</Link>
        </p>
      </div>
    </form>
  )
}
