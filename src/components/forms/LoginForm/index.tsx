'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const t = useTranslations('LoginForm')
  const locale = useLocale()

  const searchParams = useSearchParams()
  const allParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : ''
  const redirect = useRef(searchParams.get('redirect'))

  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)

        if (redirect.current) {
          router.push(redirect.current)
        } else {
          router.push(`/${locale}/account`)
        }
      } catch (_) {
        setError(t('errorInvalidCredentials'))
      }
    },
    [login, router, locale, t],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Message className="classes.message" error={error} />

      <div className="flex flex-col gap-8">
        <FormItem>
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: t('emailRequired'),
            })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password">{t('passwordLabel')}</Label>
          <Input
            id="password"
            type="password"
            {...register('password', {
              required: t('passwordRequired'),
            })}
          />
          {errors.password && (
            <FormError message={errors.password.message} />
          )}
        </FormItem>

        <div className="text-primary/70 mb-6 prose prose-a:hover:text-primary dark:prose-invert">
          <p>
            {t('forgotIntro')}{' '}
            <Link href={`/forgot-password${allParams}`}>
              {t('forgotLink')}
            </Link>
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <Button asChild variant="outline" size="lg">
          <Link
            href={`/create-account${allParams}`}
            className="grow max-w-[50%]"
          >
            {t('registerButton')}
          </Link>
        </Button>
        <Button
          className="grow"
          disabled={isLoading}
          size="lg"
          type="submit"
          variant="default"
        >
          {isLoading ? t('processing') : t('continue')}
        </Button>
      </div>
    </form>
  )
}
