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
      label: 'Section Heading',
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Section Intro',
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
      label: 'Tabs',
      required: true,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'verticalLabel',
          type: 'text',
          required: true,
          label: 'Vertical Label (right rail)',
        },
        {
          name: 'horizontalLabel',
          type: 'text',
          label: 'Horizontal Label (mobile)',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Tab Title',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Tab Description',
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
          label: 'Number Background Color',
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
