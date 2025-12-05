// src/blocks/CtaBackgroundSection.ts
import { linkGroup } from '@/fields/linkGroup'
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

export const CtaBackgroundSection: Block = {
  slug: 'ctaBackgroundSection',
  interfaceName: 'CtaBackgroundSectionBlock',
  labels: {
    singular: 'CTA (ozadje slika)',
    plural: 'CTA sekcije (ozadje slika)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      label: 'Naslov',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis',
      localized: true,
      editor: rich(),
    },
    linkGroup({
      overrides: {
        label: 'Gumbi',
        maxRows: 2,
        localized: true,
      },
    }),
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Ozadna slika',
    },
  ],
}
