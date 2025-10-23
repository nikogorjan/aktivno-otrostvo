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
            { label: 'Roza (Pink)', value: 'roza' },
            { label: 'Rumena (Yellow)', value: 'rumena' },
            { label: 'Modra (Blue)', value: 'modra' },
            { label: 'Vijolična (Purple)', value: 'vijolicna' },
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
