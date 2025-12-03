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
      label: 'Naslov',
      localized: true
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis',
      localized: true,
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
        label: 'Gumbi',
        admin: { description: 'Pod opisom.' },
        localized: true
      },
    }),
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Barva ozadja za videoposnetkom',
      defaultValue: 'modra',
      required: true,
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
      name: 'mediaTitle',
      type: 'text',
      label: 'Naslov nad videoposnetkom',
      localized: true,
      admin: {
        description: 'E.g. "Gibanje nosečnic in mamic po porodu".',
      },
    },
    {
      name: 'browserUrl',
      type: 'text',
      label: 'URL v iskalniku',
      defaultValue: 'website.com',
      localized: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Video ali slika',
    },
  ],
}
