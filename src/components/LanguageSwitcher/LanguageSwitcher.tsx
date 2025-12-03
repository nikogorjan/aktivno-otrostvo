// src/components/LanguageSwitcher.tsx
'use client'

import { Media } from '@/components/Media'
import { ChevronDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import type { Header } from 'src/payload-types'

type Lang = NonNullable<Header['languages']>[number]

function replaceLocaleInPath(pathname: string, newCode: string) {
  const parts = pathname.split('/')
  if (parts.length >= 2) {
    parts[1] = newCode
    return parts.join('/') || '/'
  }
  return `/${newCode}`
}

export function LanguageSwitcher({
  languages,
  className = '',
}: {
  languages?: Lang[] | null
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false) // 👈 hook BEFORE any early return

  const langs = Array.isArray(languages) ? languages : []
  if (langs.length === 0) return null

  const currentLocale = (pathname.split('/')[1] || 'sl').toLowerCase()
  const selected = langs.find((l) => (l?.code || '').toLowerCase() === currentLocale) ?? langs[0]

  const onPick = (lang: Lang) => {
    const code = (lang?.code || '').toLowerCase()
    if (!code || code === currentLocale) return

    const q = searchParams?.toString()
    const path = replaceLocaleInPath(pathname, code)
    const href = q ? `${path}?${q}` : path

    setOpen(false)
    router.push(href)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          flex items-center gap-2 rounded-full border
          px-2 py-2
          text-sm font-semibold uppercase
          bg-white hover:bg-neutral-100 border-neutral-300
          cursor-pointer
        "
      >
        {selected?.languageIcon ? (
          <span className="relative w-4.5 h-4.5 overflow-hidden rounded-full">
            <Media
              resource={selected.languageIcon}
              fill
              imgClassName="object-cover rounded-full border border-neutral-300"
            />
          </span>
        ) : null}
        <span className="tracking-wide">{selected?.shortTitle || selected?.code}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Dropdown – aligned under left edge */}
      {open && (
        <div
          className="
            absolute left-0 mt-1 min-w-[150px] rounded-lg border bg-white shadow-md
            z-50 py-1
          "
        >
          {langs.map((lang, i) => {
            const code = (lang?.code || '').toLowerCase()
            const isCurrent = code === currentLocale

            return (
              <button
                key={`${code}-${i}`}
                type="button"
                disabled={isCurrent}
                onClick={() => onPick(lang)}
                className={`
                  w-full px-3 py-2 text-left
                  flex items-center gap-3
                  text-sm leading-none
                  ${
                    isCurrent
                      ? 'text-neutral-400 cursor-default bg-neutral-50'
                      : 'hover:bg-neutral-100 cursor-pointer'
                  }
                `}
              >
                {lang?.languageIcon ? (
                  <span className="relative w-5 h-5 overflow-hidden rounded-full border border-neutral-300">
                    <Media
                      resource={lang.languageIcon}
                      fill
                      imgClassName="object-cover rounded-full"
                    />
                  </span>
                ) : null}

                <span className="uppercase font-semibold min-w-[26px]">
                  {lang?.shortTitle || lang?.code}
                </span>

                <span className="text-sm text-neutral-700">{lang?.title}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
