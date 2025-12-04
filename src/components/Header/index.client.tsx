'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import { Link } from '@/i18n/navigation'
import { Suspense, useEffect, useState, type MouseEvent } from 'react'

import type { Header, User } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import { cn } from '@/utilities/cn'
import { User2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'



type Props = { header: Header }

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const t = useTranslations('Header')
  const locale = useLocale()
  const pathname = usePathname()
  const currentLocale = locale

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

  const handleNavMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const half = rect.width / 2

    if (x < half) {
      el.classList.remove('hover-from-right')
      el.classList.add('hover-from-left')
    } else {
      el.classList.remove('hover-from-left')
      el.classList.add('hover-from-right')
    }
  }

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
              className="h-8 sm:h-11 w-auto"
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
                    // normalize: ensure leading slash, but NO locale here
                    if (!url.startsWith('/')) url = `/${url}`
                  }

                  const cmsLinkProps = {
                    ...link,
                    url, // locale-less path, e.g. "/", "/about", "/blog"
                  }

                  return (
                    <li key={item.id}>
                      <CMSLink
                        {...cmsLinkProps}
                        size="clear"
                        onMouseEnter={handleNavMouseEnter}
                        className={cn(
                          // base text & spacing
                          'relative pl-2 pr-2 text-xs xl:text-sm',
                          // underline pseudo-element (hidden by default)
                          'after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-full after:bg-primary',
                          'after:scale-x-0 after:transition-transform after:duration-200',
                          // show underline on hover
                          'hover:after:scale-x-100',
                          {
                            active:
                              !isExternal &&
                              (() => {
                                const targetPath =
                                  url === '/'
                                    ? `/${currentLocale}`
                                    : `/${currentLocale}${url}`

                                return pathname.startsWith(targetPath)
                              })(),
                          },
                        )}
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
            href={isLoggedIn ? '/account' : '/login'}
            aria-label={authChecked && isLoggedIn ? t('profile') : t('login')}
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
                'uppercase tracking-[0.1em] text-xs xl:text-sm font-bold',
                'py-6',
                'transition-colors duration-200',
              )}
            >
              {authChecked && isLoggedIn ? t('profile') : t('login')}
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
