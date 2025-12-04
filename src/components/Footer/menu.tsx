'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Footer } from '@/payload-types'
import { useTranslations } from 'next-intl'

interface Props {
  navItems: Footer['navItems']
  programItems?: Footer['programNavItems']
  socialLinks?: Footer['socialLinks']
}

export function FooterMenu({ navItems, programItems, socialLinks }: Props) {
  const t = useTranslations('FooterMenu')

  if (!navItems?.length && !programItems?.length && !socialLinks?.length) {
    return null
  }

  return (
    <nav className="flex flex-col gap-10 sm:gap-24 text-sm text-neutral-700 sm:inline-flex sm:flex-row sm:flex-wrap">

      {/* Vsi programi */}
      {programItems && programItems.length > 0 && (
        <div className="flex-none w-auto">
          <h3 className="mb-3 font-semibold text-neutral-900">
            {t('allPrograms')}
          </h3>

          <ul className="space-y-1.5">
            {programItems.map((item) => {
              const l = item.link
              if (!l) return null

              let href: string | undefined

              if (l.type === 'custom') {
                href = l.url ?? undefined
              } else if (l.type === 'reference' && l.reference) {
                const ref = l.reference
                const value: any = ref.value

                if (value && typeof value === 'object' && value.slug) {
                  href =
                    (ref.relationTo !== 'pages' ? `/${ref.relationTo}` : '') +
                    `/${value.slug}`
                }
              }

              const label = l.label || t('missingLabel')

              if (!href) {
                return (
                  <li key={item.id}>
                    <span className="text-neutral-500">{label}</span>
                  </li>
                )
              }

              return (
                <li key={item.id}>
                  <a href={href} className="hover:text-neutral-900">
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Navigacije */}
      {navItems && navItems.length > 0 && (
        <div className="flex-none w-auto">
          <h3 className="mb-3 font-semibold text-neutral-900">
            {t('navigation')}
          </h3>

          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.link && (
                  <CMSLink
                    appearance="inline"
                    className="hover:text-neutral-900"
                    {...item.link}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sledi mi */}
      {socialLinks && socialLinks.length > 0 && (
        <div className="flex-none w-auto">
          <h3 className="mb-3 font-semibold text-neutral-900">
            {t('followMe')}
          </h3>

          <ul className="space-y-1.5">
            {socialLinks.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                {item.icon && typeof item.icon === 'object' && (
                  <span className="inline-flex h-5 w-5 items-center justify-center">
                    <Media
                      resource={item.icon}
                      imgClassName="object-contain"
                    />
                  </span>
                )}

                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
