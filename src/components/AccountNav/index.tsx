'use client'

import { Button } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

type Props = {
  className?: string
}

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()
  const t = useTranslations('AccountNav')

  // pathname looks like "/sl/account" or "/sl/orders" etc.
  const segments = pathname.split('/')
  const currentLocale = segments[1] || 'sl'

  // HREFs are locale-less because i18n Link adds /sl or /en automatically
  const accountHref = '/account'
  const addressesHref = '/account/addresses'
  const ordersHref = '/orders'
  const logoutHref = '/logout'

  // Localized paths for active state comparison
  const accountPath = `/${currentLocale}${accountHref}`          // /sl/account
  const addressesPath = `/${currentLocale}${addressesHref}`      // /sl/account/addresses
  const ordersPath = `/${currentLocale}${ordersHref}`            // /sl/orders
  const logoutPath = `/${currentLocale}${logoutHref}`            // /sl/logout

  return (
    <div className={clsx(className)}>
      <ul className="flex flex-col gap-2">
        {/* Account settings */}
        <li>
          <Button asChild variant="link">
            <Link
              href={accountHref}
              className={clsx(
                'text-primary/50 hover:text-primary/100 hover:no-underline',
                { 'text-primary/100': pathname === accountPath },
              )}
            >
              {t('settings')}
            </Link>
          </Button>
        </li>

        {/* Addresses */}
        <li>
          <Button asChild variant="link">
            <Link
              href={addressesHref}
              className={clsx(
                'text-primary/50 hover:text-primary/100 hover:no-underline',
                { 'text-primary/100': pathname === addressesPath },
              )}
            >
              {t('addresses')}
            </Link>
          </Button>
        </li>

        {/* Orders */}
        <li>
          <Button
            asChild
            variant="link"
            className={clsx(
              'text-primary/50 hover:text-primary/100 hover:no-underline',
              {
                'text-primary/100':
                  pathname === ordersPath || pathname.includes('/orders'),
              },
            )}
          >
            <Link href={ordersHref}>{t('orders')}</Link>
          </Button>
        </li>
      </ul>

      <hr className="w-full border-white/5" />

      {/* Logout */}
      <Button
        asChild
        variant="link"
        className={clsx(
          'text-primary/50 hover:text-primary/100 hover:no-underline',
          { 'text-primary/100': pathname === logoutPath },
        )}
      >
        <Link href={logoutHref}>{t('logout')}</Link>
      </Button>
    </div>
  )
}
