// src/blocks/FormBlock/index.ts
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  labels: {
    singular: 'Kontaktni obrazec',
    plural: 'Kontaktni obrazci',
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Obrazec',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov (levo)',
      required: true,
      localized: true,
      defaultValue: 'Kontaktirajte nas',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis (levo)',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      type: 'group',
      name: 'contactInfo',
      label: 'Kontaktni podatki (levo)',
      fields: [
        {
          name: 'email',
          type: 'text',
          label: 'Email naslov',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefonska številka',
        },
        {
          name: 'facebookLabel',
          type: 'text',
          label: 'Facebook – besedilo',
          localized: true,
          defaultValue: 'Facebook',
        },
        {
          name: 'facebookUrl',
          type: 'text',
          label: 'Facebook – povezava',
        },
        {
          name: 'instagramLabel',
          type: 'text',
          label: 'Instagram – besedilo',
          localized: true,
          defaultValue: 'Instagram',
        },
        {
          name: 'instagramUrl',
          type: 'text',
          label: 'Instagram – povezava',
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
}
