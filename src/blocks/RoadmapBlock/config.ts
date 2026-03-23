// src/blocks/RoadmapSection.ts
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
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/pot.webp`
  }
  return FALLBACK_THUMB
}


export const RoadmapSection: Block = {
  slug: 'roadmapSection',
  interfaceName: 'RoadmapSectionBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Moja pot', plural: 'Moja pot' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      label: 'Naslov sekcije',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis sekcije',
      localized: true,
      editor: rich(),
    },
    {
      name: 'items',
      type: 'array',
      label: 'Koraki (roadmap)',
      required: true,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'color',
          type: 'select',
          defaultValue: 'roza',
          label: 'Barva ozadja (roza, modra, rumena)',
          options: [
            { label: 'Roza (pink)', value: 'roza' },
            { label: 'Modra (blue)', value: 'modra' },
            { label: 'Rumena (yellow)', value: 'rumena' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: 'Naslov koraka',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Opis koraka',
          localized: true,
          editor: rich(),
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Slika',
        },
      ],
    },
  ],
}
