'use client'

import { cssVariables } from '@/cssVariables'
import { cn } from '@/utilities/cn'
import type { StaticImageData } from 'next/image'
import NextImage from 'next/image'
import React from 'react'
import type { Props as MediaProps } from '../types'

const { breakpoints } = cssVariables

// ---------- helpers ----------
const getBaseURL = () => (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '')
const isAbs = (u?: string) => !!u && /^(https?:)?\/\//i.test(u)
const isBad = (u?: string) =>
  !!u && (/^\/undefined\//i.test(u) || /^undefined\//i.test(u) || u === 'undefined')
const isSVG = (u?: string) => !!u && /\.svg(\?|#|$)/i.test(u)
const joinBase = (base: string, path?: string) => {
  if (!path) return base
  if (!base) return path
  if (!base.endsWith('/') && !path.startsWith('/')) return `${base}/${path}`
  if (base.endsWith('/') && path.startsWith('/')) return `${base}${path.slice(1)}`
  return `${base}${path}`
}
// public (safe) – used if your doc has only filename
const s3Direct = (filename?: string) => {
  const b = process.env.NEXT_PUBLIC_S3_BUCKET
  const r = process.env.NEXT_PUBLIC_S3_REGION
  if (!filename || !b || !r) return undefined
  return `https://${b}.s3.${r}.amazonaws.com/${filename}`
}
// --------------------------------

export const Image: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    height: heightFromProps,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    width: widthFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps || ''
  let src: StaticImageData | string | undefined = srcFromProps

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      height: fullHeight,
      width: fullWidth,
      url,
      filename,
      updatedAt,
      sizes,
    } = resource as any

    width = widthFromProps ?? fullWidth
    height = heightFromProps ?? fullHeight
    if (altFromResource) alt = altFromResource

    const cacheTag = updatedAt ? `?${updatedAt}` : ''

    if (url && !isBad(url)) {
      // if Payload provided absolute S3 URL, use as-is; else join with site base
      src = isAbs(url) ? `${url}${cacheTag}` : `${joinBase(getBaseURL(), url)}${cacheTag}`
    } else if (filename) {
      // fallback via filename (works when only filename is stored)
      src = s3Direct(filename) || joinBase(getBaseURL(), `/media/${filename}`)
    } else if (sizes && typeof sizes === 'object') {
      // pick the first valid size url
      const firstValid: any = Object.values(sizes).find((s: any) => s?.url && !isBad(s.url))
      if (firstValid?.url) {
        src = isAbs(firstValid.url)
          ? firstValid.url
          : joinBase(getBaseURL(), firstValid.url as string)
      }
    }
  }

  if (!src) return null

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes =
    sizeFromProps ||
    Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value}px`)
      .join(', ')

  const allowBlur =
    typeof src === 'string' && !isSVG(src) && (!width || !height || Math.max(width, height) >= 40)

  return (
    <NextImage
      alt={alt}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? height || heightFromProps : undefined}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false)
        if (typeof onLoadFromProps === 'function') onLoadFromProps()
      }}
      placeholder={allowBlur ? 'empty' : undefined}
      priority={priority}
      quality={90}
      sizes={sizes}
      src={src}
      width={!fill ? width || widthFromProps : undefined}
    />
  )
}
