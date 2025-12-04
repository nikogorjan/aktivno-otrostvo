import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type Global = keyof Config['globals']

// Match what Payload expects: "en" | "sl" | "all"
type PayloadLocale = 'en' | 'sl' | 'all'

async function getGlobal<T extends Global>(
  slug: T,
  depth = 0,
  locale?: PayloadLocale,
) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    ...(locale ? { locale } : {}), // only add locale if defined
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(
  slug: T,
  depth = 0,
  locale?: PayloadLocale,
) =>
  unstable_cache(
    async () => getGlobal<T>(slug, depth, locale),
    // 🔧 cache keys must be strings
    [slug as string, String(depth), locale ?? 'default'],
    {
      tags: [
        `global_${slug}`,
        `global_${slug}_${locale ?? 'default'}`,
      ],
      revalidate: 1, // revalidate every 1 second
    },
  )
