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
          label: 'Heading',
          defaultValue: 'Ostani obveščena o vseh novicah',
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'Email placeholder',
          defaultValue: 'Email',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button label',
          defaultValue: 'Prijava',
        },
        {
          name: 'legalNote',
          type: 'text',
          label: 'Legal note under the form',
          defaultValue: 'S prijavo se strinjaš s pogoji poslovanja',
        },
      ],
    },

    {
      name: 'navItems',
      type: 'array',
      label: 'Main navigation',
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
      label: 'Program navigation',
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
