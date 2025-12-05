// src/blocks/RoadmapSection.ts
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

export const RoadmapSection: Block = {
  slug: 'roadmapSection',
  interfaceName: 'RoadmapSectionBlock',
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
      name: 'items',
      type: 'array',
      label: 'Koraki (roadmap)',
      required: true,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'color',
          type: 'select',
          defaultValue: 'roza',
          label: 'Barva ozadja (roza, modra, rumena)',
          options: [
            { label: 'Roza (pink)', value: 'roza' },
            { label: 'Modra (blue)', value: 'modra' },
            { label: 'Rumena (yellow)', value: 'rumena' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: 'Naslov koraka',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Opis koraka',
          localized: true,
          editor: rich(),
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Slika',
        },
      ],
    },
  ],
}
