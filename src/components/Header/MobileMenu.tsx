// MobileMenu.tsx
'use client'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/providers/Auth'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'

interface Props {
  menu: Header['navItems']
  languages: Header['languages']
}

export function MobileMenu({ menu, languages }: Props) {
  const { user } = useAuth()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = () => setIsOpen(false)
  const currentLocale = (pathname.split('/')[1] || 'sl').toLowerCase()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger className="relative flex h-11 w-11 items-center justify-center rounded-md text-black transition-colors dark:bg-black dark:text-white">
        <MenuIcon className="h-4" />
      </SheetTrigger>

      <SheetContent side="left" className="px-4">
        <SheetHeader className="px-0 pt-4 pb-0">
          <SheetTitle>Navigacija</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <div className="py-4">
          {menu?.length ? (
            <ul className="flex w-full flex-col">
              {menu.map((item) => {
                const link = item.link
                let url = link.url || '/'

                const isExternal =
                  url.startsWith('http://') ||
                  url.startsWith('https://') ||
                  url.startsWith('mailto:')

                if (!isExternal) {
                  if (!url.startsWith('/')) url = `/${url}`

                  url =
                    url === '/'
                      ? `/${currentLocale}`
                      : `/${currentLocale}${url}`
                }

                const localizedLink = { ...link, url }

                return (
                  <li className="py-2" key={item.id}>
                    <CMSLink {...localizedLink} appearance="link" />
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>

        {/* LANG SWITCHER AT TOP OF SHEET */}
        <div className="mt-4 mb-2">
          <LanguageSwitcher languages={languages} />
        </div>

        {user ? (
          <div className="mt-4">
            <h2 className="text-xl mb-4">Moj račun</h2>
            <hr className="my-2" />
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/orders">Nakupi</Link>
              </li>
              <li>
                <Link href="/account/addresses">Lokacija</Link>
              </li>
              <li>
                <Link href="/account">Nastavitve</Link>
              </li>
              <li className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/logout">Odjava</Link>
                </Button>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <h2 className="text-xl mb-4">Moj račun</h2>
            <div className="flex flex-col items-center gap-2 mt-4">
              <Button asChild className="w-full" variant="outline">
                <Link href="/login">Prijava</Link>
              </Button>

              <Button asChild className="w-full">
                <Link href="/create-account">Ustvari račun</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
