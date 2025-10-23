'use client'

import { cn } from '@/utilities/cn'
import React, { useEffect, useRef } from 'react'
import type { Props as MediaProps } from '../types'

// ---------- helpers ----------
const getBaseURL = () => (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '')
const isAbs = (u?: string) => !!u && /^(https?:)?\/\//i.test(u)
const isBad = (u?: string) =>
  !!u && (/^\/undefined\//i.test(u) || /^undefined\//i.test(u) || u === 'undefined')
const joinBase = (base: string, path?: string) => {
  if (!path) return base
  if (!base) return path
  if (!base.endsWith('/') && !path.startsWith('/')) return `${base}/${path}`
  if (base.endsWith('/') && path.startsWith('/')) return `${base}${path.slice(1)}`
  return `${base}${path}`
}
const s3Direct = (filename?: string) => {
  const b = process.env.NEXT_PUBLIC_S3_BUCKET
  const r = process.env.NEXT_PUBLIC_S3_REGION
  if (!filename || !b || !r) return undefined
  return `https://${b}.s3.${r}.amazonaws.com/${filename}`
}
// --------------------------------

export const Video: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (v) v.addEventListener('suspend', () => {})
  }, [])

  if (!(resource && typeof resource === 'object')) return null

  const { url, filename, mimeType } = resource as any
  if (!mimeType?.includes('video')) return null

  let src: string | undefined

  if (url && !isBad(url)) {
    src = isAbs(url) ? url : joinBase(getBaseURL(), url)
  } else if (filename) {
    src = s3Direct(filename) || joinBase(getBaseURL(), `/media/${filename}`)
  }

  if (!src) return null

  return (
    <video
      autoPlay
      className={cn(videoClassName)}
      controls={false}
      loop
      muted
      onClick={onClick}
      playsInline
      preload="metadata"
      ref={videoRef}
    >
      <source src={src} />
    </video>
  )
}
