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

const FALLBACK_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120' fill='none'>
    <rect x='10' y='10' width='140' height='100' rx='10' stroke='#CFCFCF' stroke-width='2'/>
    <path d='M10 60h140' stroke='#CFCFCF' stroke-width='2'/>
    <circle cx='40' cy='35' r='12' stroke='#CFCFCF' stroke-width='2' fill='none'/>
    <path d='M22 92l20-20 12 12 24-24 30 32' stroke='#CFCFCF' stroke-width='2' fill='none'/>
  </svg>
`)}`
function getThumbURL() {
  const fromEnv = (process.env.CREATIVE_GROWTH_SCROLLER_ICON_URL || '').trim()
  if (fromEnv) return fromEnv
  // Optional: build from bucket/region if you keep admin icons in a known path
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/active-services.webp`
  }
  return FALLBACK_THUMB
}

export const ProgramGridSection: Block = {
  slug: 'programGridSection',
  interfaceName: 'ProgramGridSectionBlock',
  imageURL: getThumbURL(),
  labels: {
    singular: 'Storitve',
    plural: 'Storitve',
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
