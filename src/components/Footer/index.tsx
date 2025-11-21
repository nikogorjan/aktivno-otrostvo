
import type { Footer as FooterType } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { Media } from '@/components/Media'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { CMSLink } from '../Link'

const { COMPANY_NAME, SITE_NAME } = process.env

export async function Footer() {
  const footer: FooterType = await getCachedGlobal('footer', 1)()
  const navItems = footer.navItems || []
  const programItems = footer.programNavItems || []
  const socialLinks = footer.socialLinks || []
  const newsletter = footer.newsletter
  const terms = footer.terms

  const currentYear = new Date().getFullYear()
  const copyrightDate = currentYear
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700'
  const copyrightName = 'Aktivno otroštvo'

  console.log('footer', footer)
  console.log('program items', programItems)
  console.log('social links', socialLinks)

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400 bg-card">
      {/* TOP AREA */}
      <div className="container">
        <div className="flex w-full flex-col gap-10 border-t border-neutral-200 py-12 text-sm dark:border-neutral-700 md:gap-12">
          <div className="grid gap-10 md:gap-32 md:grid-cols-[minmax(0,2.2fr)_minmax(0,3fr)]">
            {/* LEFT: newsletter */}
            <div className="max-w-lg">
              {newsletter?.illustration && typeof newsletter.illustration === 'object' ? (
                <div className="mb-6 h-16 w-auto">
                  <Media resource={newsletter.illustration} imgClassName="h-16 w-auto object-contain" />
                </div>
              ) : (
                <Link href="/" aria-label="Home" className="mb-6 inline-flex items-center">
                  <Image
                    src="https://bloom42-media.s3.eu-central-1.amazonaws.com/Logo.png"
                    alt="Aktivno Otroštvo logo"
                    width={160}
                    height={40}
                    priority
                    className="h-8 w-auto"
                  />
                </Link>
              )}

              {newsletter?.heading && (
                <p className="mb-4 text-base font-medium text-neutral-900">
                  {newsletter.heading}
                </p>
              )}

              {/* email + button (visual only) */}
              <form className="flex max-w-md flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder={newsletter?.placeholder ?? 'Email'}
                  className="flex-1 rounded-full bg-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
                <CMSLink
                  type="custom"
                  url="#"
                  appearance="siv"
                  className="self-start mt-2 flex items-center gap-1 sm:mt-0 sm:ml-3"
                >
                  {newsletter?.buttonLabel ?? 'Prijava'}
                </CMSLink>
              </form>

              {newsletter?.legalNote && (
                <p className="mt-2 text-xs text-neutral-500">{newsletter.legalNote}</p>
              )}
            </div>

            {/* RIGHT: menus */}
            <Suspense
              fallback={
                <div className="flex h-[188px] w-[200px] flex-col gap-2">
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                </div>
              }
            >
              <div className="flex md:justify-end">
                <FooterMenu
                  navItems={navItems}
                  programItems={programItems}
                  socialLinks={socialLinks}
                />
              </div>
            </Suspense>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
  <div
    className="
      container mx-auto flex w-full
      flex-col items-center gap-2 text-center
      sm:flex-row sm:gap-4 sm:text-left
    "
  >
    <p>
      &copy; {copyrightDate} {copyrightName}
      {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} Vse pravice pridržane.
    </p>

    <hr className="hidden h-4 w-[1px] border-l border-neutral-400 sm:inline-block" />

    <p>Izdelano v Sloveniji</p>

    {/* Terms link on the right */}
    <div className="w-full sm:w-auto sm:ml-auto sm:text-right">
      {terms?.url && (
        <a
          href={terms.url}
          className="text-neutral-800 underline-offset-2 hover:underline dark:text-white"
        >
          {terms.label || 'Pogoji poslovanja'}
        </a>
      )}
    </div>
  </div>
</div>
    </footer>
  )
}
