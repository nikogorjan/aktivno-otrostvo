'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { ShoppingCart } from 'lucide-react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Open cart"
      className={cn(
        // layout
        'relative grid h-11 w-11 place-items-center rounded-md transition-colors',
        // light mode
        ' text-primary/100 hover:text-primary/50 hover:bg-neutral-100',
        // dark mode
        'dark:border-neutral-700 dark:bg-black dark:text-primary/100 dark:hover:text-primary/50 dark:hover:bg-neutral-900',
        className,
      )}
      {...rest}
    >
      <ShoppingCart className="h-5 w-5 transition-colors duration-200" />
      {typeof quantity === 'number' && quantity > 0 && (
        <span
          className={cn(
            'absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full',
            'bg-primary px-1 text-[10px] font-semibold text-primary-foreground',
          )}
        >
          {quantity}
        </span>
      )}
    </Button>
  )
}
