import type { Page, Product } from '@/payload-types'
import type { AnchorHTMLAttributes } from 'react'
import React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import { ArrowUpRight } from 'lucide-react'

type CMSLinkBaseProps = {
  appearance?: 'inline' | ButtonProps['variant']  // includes "nav"
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Product | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

type CMSLinkType = CMSLinkBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'>

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    ...rest
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${reference.value.slug}`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const showArrow =
    appearance === 'default' || appearance === 'rumen' || appearance === 'siv'

  // 🔹 For pure text links (e.g. in content, footer)
  if (appearance === 'inline') {
    return (
      <Link
        className={cn(className)}
        href={href}
        {...newTabProps}
        {...rest}
      >
        {label ?? children}
      </Link>
    )
  }

  // 🔹 For button-like + nav variants -> use Button + Slot
  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link
        // ✅ Only add extra padding for CTA buttons that show arrow
        className={cn(showArrow && 'pl-4 pr-1.5')}
        href={href}
        {...newTabProps}
        {...rest}
      >
        {label ?? children}

        {showArrow && (
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white text-neutral-dark size-9">
            <ArrowUpRight className="size-6" />
          </span>
        )}
      </Link>
    </Button>
  )
}
