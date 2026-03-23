import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

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
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/video-section.webp`
  }
  return FALLBACK_THUMB
}


export const VideoSection: Block = {
  slug: 'videoSection',
  interfaceName: 'VideoSectionBlock',
    imageURL: getThumbURL(),
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
