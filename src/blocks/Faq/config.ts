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
      label: 'Section Heading',
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
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
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          label: 'Answer',
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
