// src/blocks/ValuesSection.ts
import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

const rich = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h4'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const ValuesSection: Block = {
  slug: 'valuesSection',
  interfaceName: 'ValuesSectionBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      label: 'Naslov sekcije',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis sekcije',
      localized: true,
      editor: rich(),
    },
    {
      name: 'values',
      type: 'array',
      label: 'Vrednote',
      required: true,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Ikona',
        },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'roza',
          label: 'Barva ozadja ikone',
          options: [
            { label: 'Roza (pink)', value: 'roza' },
            { label: 'Oranžna (peach)', value: 'oranzna' },
            { label: 'Rumena (yellow)', value: 'rumena' },
            { label: 'Zelena (green)', value: 'zelena' },
            { label: 'Vijolična (purple)', value: 'vijolicna' },
            { label: 'Modra (blue)', value: 'modra' },
            { label: 'Mint (light green)', value: 'mint' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: 'Naslov vrednote',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Opis vrednote',
          localized: true,
          editor: rich(),
        },
      ],
    },
  ],
}
