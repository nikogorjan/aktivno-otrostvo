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

  return (
    <div className={clsx(className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Button asChild variant="link">
            <Link
              href="/account"
              className={clsx('text-primary/50 hover:text-primary/100 hover:no-underline', {
                'text-primary/100': pathname === '/account',
              })}
            >
              Nastavitve
            </Link>
          </Button>
        </li>

        <li>
          <Button asChild variant="link">
            <Link
              href="/account/addresses"
              className={clsx('text-primary/50 hover:text-primary/100 hover:no-underline', {
                'text-primary/100': pathname === '/account/addresses',
              })}
            >
              Lokacije
            </Link>
          </Button>
        </li>

        <li>
          <Button
            asChild
            variant="link"
            className={clsx('text-primary/50 hover:text-primary/100 hover:no-underline', {
              'text-primary/100': pathname === '/orders' || pathname.includes('/orders'),
            })}
          >
            <Link href="/orders">Naročila</Link>
          </Button>
        </li>
      </ul>

      <hr className="w-full border-white/5" />

      <Button
        asChild
        variant="link"
        className={clsx('text-primary/50 hover:text-primary/100 hover:no-underline', {
          'text-primary/100': pathname === '/logout',
        })}
      >
        <Link href="/logout">Odjava</Link>
      </Button>
    </div>
  )
}
