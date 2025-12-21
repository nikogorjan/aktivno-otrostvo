'use client'

import { cn } from '@/utilities/cn'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type Locale = 'sl' | 'en'

type CategoryDoc = {
  id: string
  title?: string | null
  slug?: string | null
}

export const CategoryFilter: React.FC<{
  locale: Locale
  categories: CategoryDoc[]
  activeSlug?: string
  className?: string
}> = ({ locale, categories, activeSlug, className }) => {
  const router = useRouter()
  const sp = useSearchParams()

  const goToCategory = (slug?: string) => {
    const next = new URLSearchParams(sp?.toString())

    // When changing category, always go back to the first page (/posts)
    if (!slug) next.delete('category')
    else next.set('category', slug)

      console.log('clicked', slug)

    const query = next.toString()
    router.push(`/${locale}/posts${query ? `?${query}` : ''}`)
  }


  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {/* "All" */}
      <button
        type="button"
        onClick={() => goToCategory(undefined)}
        className={cn(
          'rounded-[6px] border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition',
          !activeSlug
            ? 'border-foreground/30 bg-foreground/10 text-foreground'
            : 'border-border bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        )}
      >
        Vse
      </button>

      {categories.map((c) => {
        const slug = c.slug || ''
        const isActive = !!slug && slug === activeSlug

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => goToCategory(slug)}
            className={cn(
              'rounded-[6px] border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition',
              isActive
                ? 'border-foreground/30 bg-foreground/10 text-foreground'
                : 'border-border bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            {c.title || 'Untitled'}
          </button>
        )
      })}
    </div>
  )
}
