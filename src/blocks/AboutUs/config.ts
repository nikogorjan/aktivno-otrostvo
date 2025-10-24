import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const AboutUsSection: Block = {
  slug: 'aboutUsSection',
  interfaceName: 'AboutUsSectionBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    linkGroup({
      overrides: {
        label: 'Buttons',
        admin: { description: 'Primary CTA(s) shown under the description.' },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
  ],
}
