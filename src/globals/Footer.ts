import { link } from '@/fields/link'
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'newsletter',
      type: 'group',
      label: 'Newsletter',
      fields: [
        {
          name: 'illustration',
          type: 'upload',
          relationTo: 'media',
          label: 'Illustration',
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Opomba',
          defaultValue: 'Ostani obveščena o vseh novicah',
          localized: true,
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'E-mail vnos',
          defaultValue: 'Email',
          localized: true,

        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Napis na gumb',
          defaultValue: 'Prijava',
          localized: true,

        },
        {
          name: 'legalNote',
          type: 'text',
          label: 'Sporočilo o pogojih poslovanja',
          defaultValue: 'S prijavo se strinjaš s pogoji poslovanja',
          localized: true,

        },
      ],
    },

    {
      name: 'navItems',
      type: 'array',
      label: 'Navigacije',
      localized: true,
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
      ],
    },

    {
      name: 'programNavItems',
      type: 'array',
      label: 'Programi',
      localized: true,
      maxRows: 10,
      fields: [
        link({
          appearances: false,
        }),
      ],
    },

    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social links',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label (e.g. Facebook)',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },

    {
      name: 'terms',
      type: 'group',
      label: 'Terms link',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          defaultValue: 'Pogoji poslovanja',
          localized: true,

        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },
  ],
}
