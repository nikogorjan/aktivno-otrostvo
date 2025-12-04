import { getCachedGlobal } from '@/utilities/getGlobals'

import { getLocale } from 'next-intl/server'
import { HeaderClient } from './index.client'
import './index.css'

export async function Header() {
  const locale = await getLocale() // "en" | "sl"
  const header = await getCachedGlobal('header', 1, locale as 'en' | 'sl')()

  return <HeaderClient header={header} />
}
