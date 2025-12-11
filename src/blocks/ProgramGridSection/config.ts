import { linkGroup } from '@/fields/linkGroup'
import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
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

export const ProgramGridSection: Block = {
  slug: 'programGridSection',
  interfaceName: 'ProgramGridSectionBlock',
  labels: {
    singular: 'Program Grid Section',
    plural: 'Program Grid Sections',
  },
  fields: [
    {
      name: 'programs',
      type: 'array',
      label: 'Programi',
      minRows: 1,
      admin: {
        description: 'Vsak element predstavlja eno kartico',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Slika',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
          label: 'Naslov',
        },
        {
          name: 'description',
          type: 'richText',
          localized: true,
          label: 'Opis',
          editor: rich(),
        },
        linkGroup({
          overrides: {
            label: 'Gumb',
            maxRows: 1,
            localized: true,
          },
        }),
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Barva ozadja kartice',
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
      ],
    },
  ],
}
