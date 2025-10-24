import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { LogoutPage } from './LogoutPage'

export default async function Logout() {
  return (
    <div className="container max-w-lg my-16">
      <LogoutPage />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Odjava uspešna.',
  openGraph: mergeOpenGraph({
    title: 'Logout',
    url: '/logout',
  }),
  title: 'Logout',
}
