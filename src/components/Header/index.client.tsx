'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'

import type { Header, User } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import { cn } from '@/utilities/cn'
import { User2 } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'

type Props = { header: Header }

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const currentLocale = (pathname.split('/')[1] || 'sl').toLowerCase()

  // --- AUTH STATE ---
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
          credentials: 'include',
        })

        if (!res.ok) {
          setAuthUser(null)
          return
        }

        const data = await res.json()
        // Payload's /me typically returns { user: {...} }
        setAuthUser(data?.user ?? null)
      } catch (e) {
        setAuthUser(null)
      } finally {
        setAuthChecked(true)
      }
    }

    checkAuth()
  }, [])

  const isLoggedIn = !!authUser

  return (
    <div className="relative z-20 border-b bg-card">
      <nav className="container flex items-center justify-between ">
        {/* LEFT: Logo (mobile + desktop) */}
        <div className="flex items-center">
          <Link href="/" aria-label="Home" className="flex items-center py-3">
            <Image
              src="https://bloom42-media.s3.eu-central-1.amazonaws.com/Logo.png"
              alt="Aktivno Otroštvo logo"
              width={160}
              height={40}
              priority
              className="h-9 w-auto"
            />
          </Link>
          <div className="hidden lg:flex md:flex-1 md:justify-center ml-6">
            {menu.length ? (
              <ul className="flex items-center gap-5 text-sm">
                {menu.map((item) => {
                  const link = item.link

                  let url = link.url || '/'

                  const isExternal =
                    url.startsWith('http://') ||
                    url.startsWith('https://') ||
                    url.startsWith('mailto:')

                  if (!isExternal) {
                    // normalize: remove double leading slash
                    if (!url.startsWith('/')) url = `/${url}`

                    url =
                      url === '/'
                        ? `/${currentLocale}`
                        : `/${currentLocale}${url}`
                  }

                  const localizedLink = {
                    ...link,
                    url,
                  }

                  return (
                    <li key={item.id}>
                      <CMSLink
                        {...localizedLink}
                        size="clear"
                        className={cn('relative navLink pl-3 pr-3', {
                          active:
                            localizedLink.url && localizedLink.url !== `/${currentLocale}`
                              ? pathname.includes(localizedLink.url)
                              : false,
                        })}
                        appearance="nav"
                      />
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
        </div>

        {/* CENTER: Desktop nav */}

        {/* RIGHT: Icons (account + cart) and hamburger on mobile */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden lg:block">
            <LanguageSwitcher languages={header.languages} />
          </div>
          {/* Account button */}
          <Link
            href={
              isLoggedIn
                ? `/${currentLocale}/account`
                : `/${currentLocale}/login`
            }
            aria-label={isLoggedIn ? 'Profil' : 'Prijava'}
            className={cn(
              'group relative flex h-11 items-center gap-2 px-3 rounded-md',
              'text-primary/100 transition-colors',
              'hover:bg-neutral-100 hover:text-primary/50',
              'dark:bg-black dark:text-white dark:hover:bg-neutral-900',
            )}
          >
            <User2 className="h-5 w-5 transition-colors duration-200" />

            <span
              className={cn(
                'uppercase tracking-[0.1em] text-xs md:text-sm font-bold',
                'py-6', // if you really need vertical padding
                'transition-colors duration-200',
                // no own hover: let it inherit from parent
              )}
            >
              {authChecked && isLoggedIn ? 'Profil' : 'Prijava'}
            </span>
          </Link>

          {/* Cart icon */}
          <div className="relative">
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>

          {/* Mobile hamburger */}
          <div className="block lg:hidden">
            <MobileMenu menu={menu} languages={header.languages} />
          </div>
        </div>
      </nav>
    </div>
  )
}
