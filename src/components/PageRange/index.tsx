'use client'

import { useTranslations } from 'next-intl'
import React from 'react'

const defaultLabels = {
  plural: 'documents',
  singular: 'document',
} as const

const defaultCollectionLabels = {
  posts: {
    plural: 'posts',
    singular: 'post',
  },
} as const

type Locale = 'sl' | 'en'

export const PageRange: React.FC<{
  locale: Locale
  className?: string
  collection?: keyof typeof defaultCollectionLabels
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const t = useTranslations('PageRange')

  const { className, collection, collectionLabels: collectionLabelsFromProps, currentPage, limit, totalDocs } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const labels =
    collectionLabelsFromProps ||
    (collection ? defaultCollectionLabels[collection] : undefined) ||
    defaultLabels

  if (typeof totalDocs === 'undefined' || totalDocs === 0) {
    return (
      <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
        {t('noResults')}
      </div>
    )
  }

  // ✅ ensure these are ALWAYS strings
  const plural = labels.plural ?? defaultLabels.plural
  const singular = labels.singular ?? defaultLabels.singular
  const label: string = totalDocs > 1 ? plural : singular

  const range = indexStart > 0 ? `${t('rangeSeparator')}${indexEnd}` : ''

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {t('showing', {
        start: indexStart,
        range,
        total: totalDocs,
        label,
      })}
    </div>
  )
}
