'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  // derive current locale from URL: /sl/account, /en/account, etc.
  const segments = pathname.split('/')
  const currentLocale = (segments[1] || 'sl').toLowerCase()

  const accountPath = `/${currentLocale}/account`
  const addressesPath = `/${currentLocale}/account/addresses`
  const ordersPath = `/${currentLocale}/orders`
  const logoutPath = `/${currentLocale}/logout`

  return (
    <div className={clsx(className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Button asChild variant="link">
            <Link
              href={accountPath}
              className={clsx(
                'text-primary/50 hover:text-primary/100 hover:no-underline',
                {
                  'text-primary/100': pathname === accountPath,
                },
              )}
            >
              Nastavitve
            </Link>
          </Button>
        </li>

        <li>
          <Button asChild variant="link">
            <Link
              href={addressesPath}
              className={clsx(
                'text-primary/50 hover:text-primary/100 hover:no-underline',
                {
                  'text-primary/100': pathname === addressesPath,
                },
              )}
            >
              Lokacije
            </Link>
          </Button>
        </li>

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
            <Link href={ordersPath}>Naročila</Link>
          </Button>
        </li>
      </ul>

      <hr className="w-full border-white/5" />

      <Button
        asChild
        variant="link"
        className={clsx(
          'text-primary/50 hover:text-primary/100 hover:no-underline',
          {
            'text-primary/100': pathname === logoutPath,
          },
        )}
      >
        <Link href={logoutPath}>Odjava</Link>
      </Button>
    </div>
  )
}
