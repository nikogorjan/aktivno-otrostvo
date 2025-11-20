import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const VideoSection: Block = {
  slug: 'videoSection',
  interfaceName: 'VideoSectionBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading (left, large)',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description (right column)',
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
      name: 'backgroundColor',
      type: 'select',
      label: 'Background color behind video',
      defaultValue: 'modra',
      required: true,
      options: [
        { label: 'Modra (blue)', value: 'modra' },
        { label: 'Roza (pink)', value: 'roza' },
        { label: 'Rumena (yellow)', value: 'rumena' },
        { label: 'Zelena (green)', value: 'zelena' },
      ],
    },
    {
      name: 'mediaTitle',
      type: 'text',
      label: 'Title inside the video frame',
      admin: {
        description: 'E.g. "Gibanje nosečnic in mamic po porodu".',
      },
    },
    {
      name: 'browserUrl',
      type: 'text',
      label: 'URL in browser bar',
      defaultValue: 'website.com',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Video or image',
    },
  ],
}
