'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const pathname = usePathname()
  const segments = pathname.split('/')
  const currentLocale = (segments[1] || 'sl').toLowerCase()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('Odjava uspešna.')
      } catch (_) {
        setError('Si že odjavljen.')
      }
    }

    void performLogout()
  }, [logout])

  return (
    <Fragment>
      {(error || success) && (
        <div className="prose dark:prose-invert">
          <h1>{error || success}</h1>
          <p>
            Kaj želite storiti zdaj?
            <Fragment>
              {' '}
              <Link href={`/${currentLocale}/search`}>Click here</Link>
              {` to shop.`}
            </Fragment>
            {` To log back in, `}
            <Link href={`/${currentLocale}/login`}>click here</Link>.
          </p>
        </div>
      )}
    </Fragment>
  )
}
