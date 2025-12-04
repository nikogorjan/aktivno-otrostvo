import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      localized: true,
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
    {
      name: 'languages',
      label: 'Languages',
      type: 'array',
      labels: { singular: 'Language', plural: 'Languages' },
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: true,
        description: 'Languages available in the header switcher. Use short code like "en", "sl".',
      },
      fields: [
        {
          name: 'code',
          label: 'Locale Code',
          type: 'text',
          required: true,
          admin: { width: '33%' }, // e.g. "en", "sl"
        },
        {
          name: 'title',
          label: 'Language Name',
          type: 'text',
          required: true,
          localized: true,
          admin: { width: '33%' }, // e.g. "English", "Slovenščina"
        },
        {
          name: 'shortTitle',
          label: 'Short Label',
          type: 'text',
          required: true,
          admin: { width: '33%' }, // e.g. "EN", "SL"
        },
        {
          name: 'languageIcon',
          label: 'Flag / Icon',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
  ],
}
