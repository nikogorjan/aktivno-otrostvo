import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const TabsSection: Block = {
  slug: 'tabsSection',
  interfaceName: 'TabsSectionBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Naslov',
      localized: true,
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Opis',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'items',
      type: 'array',
      label: 'Stebri',
      required: true,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'verticalLabel',
          type: 'text',
          required: true,
                localized: true,
          label: 'Verticalni naslov ',
        },
        {
          name: 'horizontalLabel',
          type: 'text',
          label: 'Horizontalni naslov (mobile)',
                localized: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Naslov (ko je odprto)',
                localized: true,
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Opis',
                localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'roza',
          label: 'Barva krogca',
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
      ],
    },
  ],
}
