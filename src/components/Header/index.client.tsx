'use client'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Suspense } from 'react'

import type { Header } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import Logo from '@/../public/media/Logo.png'
import { cn } from '@/utilities/cn'
import { User2 } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type Props = { header: Header }

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <div className="relative z-20 border-b bg-card">
      <nav className="container flex items-center justify-between ">
        {/* LEFT: Logo (mobile + desktop) */}
        <div className="flex items-center">
          <Link href="/" aria-label="Home" className="flex items-center py-3">
            <Image src={Logo} alt="Aktivno Otroštvo logo" priority className="h-8 w-auto" />
          </Link>
        </div>

        {/* CENTER: Desktop nav */}
        <div className="hidden md:flex md:flex-1 md:justify-center">
          {menu.length ? (
            <ul className="flex items-center gap-5 text-sm">
              {menu.map((item) => (
                <li key={item.id}>
                  <CMSLink
                    {...item.link}
                    size="clear"
                    className={cn('relative navLink', {
                      active:
                        item.link.url && item.link.url !== '/'
                          ? pathname.includes(item.link.url)
                          : false,
                    })}
                    appearance="nav"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* RIGHT: Icons (account + cart) and hamburger on mobile */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Account icon */}
          <Link
            href="/login"
            aria-label="Login"
            className={cn(
              'relative grid h-11 w-11 place-items-center rounded-md  transition-colors',
              ' hover:text-primary/50 hover:bg-neutral-100 text-primary/100',
              ' dark:bg-black dark:text-white dark:hover:bg-neutral-900',
            )}
          >
            <User2 className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
          </Link>

          {/* Cart icon (Suspense to match your existing Cart behavior) */}
          <div className="relative">
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>

          {/* Mobile hamburger (to the RIGHT of icons) */}
          <div className="block md:hidden">
            <MobileMenu menu={menu} />
          </div>
        </div>
      </nav>
    </div>
  )
}
