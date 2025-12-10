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
      HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const ImageTextSection: Block = {
  slug: 'imageTextSection',
  interfaceName: 'ImageTextSectionBlock',
  labels: {
    singular: 'Sekcija: slika + besedilo',
    plural: 'Sekcije: slika + besedilo',
  },
  fields: [
    {
      name: 'alignment',
      type: 'select',
      label: 'Postavitev',
      defaultValue: 'imageRight',
      required: true,
      admin: {
        description: 'Izberi, ali bo slika na levi ali desni strani.',
      },
      options: [
        { label: 'Slika na desni', value: 'imageRight' },
        { label: 'Slika na levi', value: 'imageLeft' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Naslov sekcije',
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis sekcije',
      localized: true,
      editor: rich(),
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Barva ozadja za sliko',
      defaultValue: 'roza',
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
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Slika',
      admin: {
        description: 'Slika, ki bo prikazana v barvnem okvirju.',
      },
    },
  ],
}
