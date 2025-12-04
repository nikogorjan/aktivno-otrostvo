'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import React from 'react'

export const AddressListing: React.FC = () => {
  const { addresses } = useAddresses()
  const t = useTranslations('AddressListing')

  if (!addresses || addresses.length === 0) {
    return <p>{t('noAddresses')}</p>
  }

  return (
    <div>
      <ul className="flex flex-col gap-8">
        {addresses.map((address) => (
          <li key={address.id} className="border-b pb-8 last:border-none">
            <AddressItem address={address} />
          </li>
        ))}
      </ul>
    </div>
  )
}
