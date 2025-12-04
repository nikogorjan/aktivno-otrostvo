'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormData = {
  email: string
  name: User['name']
  password: string
  passwordConfirm: string
}

export const AccountForm: React.FC = () => {
  const { setUser, user } = useAuth()
  const [changePassword, setChangePassword] = useState(false)
  const password = useRef('')

  const t = useTranslations('AccountForm')
  const locale = useLocale()

  const {
    formState: { errors, isLoading, isSubmitting, isDirty },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>()

  password.current = watch('password', '')
  password.current = watch('password', '')

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
          {
            body: JSON.stringify(data),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
          },
        )

        if (response.ok) {
          const json = await response.json()
          setUser(json.doc)
          toast.success(t('toastUpdateSuccess'))
          setChangePassword(false)
          reset({
            name: json.doc.name,
            email: json.doc.email,
            password: '',
            passwordConfirm: '',
          })
        } else {
          toast.error(t('toastUpdateError'))
        }
      }
    },
    [user, setUser, reset, t],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/${locale}/login?error=${encodeURIComponent(
          t('mustBeLoggedIn'),
        )}&redirect=${encodeURIComponent('/account')}`,
      )
    }

    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, router, reset, changePassword, locale, t])

  return (
    <form className="max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      {!changePassword ? (
        <Fragment>
          <div className="prose dark:prose-invert mb-8">
            <p>
              {t('changeDetailsIntro')}{' '}
              <Button
                className="px-0 text-inherit underline hover:cursor-pointer"
                onClick={() => setChangePassword(!changePassword)}
                type="button"
                variant="link"
              >
                {t('clickHere')}
              </Button>{' '}
              {t('toChangePassword')}
            </p>
          </div>

          <div className="flex flex-col gap-8 mb-8">
            <FormItem>
              <Label htmlFor="email" className="mb-2">
                {t('emailLabel')}
              </Label>
              <Input
                id="email"
                {...register('email', {
                  required: t('errorEmailRequired'),
                })}
                type="email"
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="name" className="mb-2">
                {t('nameLabel')}
              </Label>
              <Input
                id="name"
                {...register('name', {
                  required: t('errorNameRequired'),
                })}
                type="text"
              />
              {errors.name && <FormError message={errors.name.message} />}
            </FormItem>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="prose dark:prose-invert mb-8">
            <p>
              {t('changePasswordIntro')}{' '}
              <Button
                className="px-0 text-inherit underline hover:cursor-pointer"
                onClick={() => setChangePassword(!changePassword)}
                type="button"
                variant="link"
              >
                {t('cancel')}
              </Button>
              .
            </p>
          </div>

          <div className="flex flex-col gap-8 mb-8">
            <FormItem>
              <Label htmlFor="password" className="mb-2">
                {t('newPasswordLabel')}
              </Label>
              <Input
                id="password"
                {...register('password', {
                  required: t('errorPasswordRequired'),
                })}
                type="password"
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="passwordConfirm" className="mb-2">
                {t('confirmPasswordLabel')}
              </Label>
              <Input
                id="passwordConfirm"
                {...register('passwordConfirm', {
                  required: t('errorPasswordConfirmRequired'),
                  validate: (value) =>
                    value === password.current || t('errorPasswordMismatch'),
                })}
                type="password"
              />
              {errors.passwordConfirm && (
                <FormError message={errors.passwordConfirm.message} />
              )}
            </FormItem>
          </div>
        </Fragment>
      )}

      <Button
        disabled={isLoading || isSubmitting || !isDirty}
        type="submit"
        variant="default"
      >
        {isLoading || isSubmitting
          ? t('submitProcessing')
          : changePassword
            ? t('submitChangePassword')
            : t('submitUpdateAccount')}
      </Button>
    </form>
  )
}
