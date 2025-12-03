import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const FaqSection: Block = {
  slug: 'faqSection',
  interfaceName: 'FaqSectionBlock',
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
      label: 'FAQs',
      required: true,
            localized: true,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Vprašanje',
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          label: 'Odgovor',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
  ],
}
