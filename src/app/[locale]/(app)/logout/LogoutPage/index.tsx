'use client'

import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { useTranslations } from 'next-intl'
import React, { Fragment, useEffect, useState } from 'react'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()
  const t = useTranslations('LogoutPageClient')

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess(t('success'))
      } catch (_) {
        setError(t('alreadyLoggedOut'))
      }
    }

    void performLogout()
  }, [logout, t])

  const message = error || success

  return (
    <Fragment>
      {message && (
        <div className="prose dark:prose-invert">
          <h1>{message}</h1>
          <p>
            {t('whatNext')}{' '}
            <Fragment>
              <Link href="/search">{t('shopLinkText')}</Link>
              {t('shopSuffix')}{' '}
            </Fragment>
            {t('loginPrefix')}
            <Link href="/login">{t('loginLinkText')}</Link>.
          </p>
        </div>
      )}
    </Fragment>
  )
}
