// src/blocks/FormBlock/index.ts
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

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
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/active-contact.webp`
  }
  return FALLBACK_THUMB
}

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  labels: {
    singular: 'Kontaktni obrazec',
    plural: 'Kontaktni obrazci',
  },
  imageURL: getThumbURL(),
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Obrazec',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov (levo)',
      required: true,
      localized: true,
      defaultValue: 'Kontaktirajte nas',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis (levo)',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      type: 'group',
      name: 'contactInfo',
      label: 'Kontaktni podatki (levo)',
      fields: [
        {
          name: 'email',
          type: 'text',
          label: 'Email naslov',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefonska številka',
        },
        {
          name: 'facebookLabel',
          type: 'text',
          label: 'Facebook – besedilo',
          localized: true,
          defaultValue: 'Facebook',
        },
        {
          name: 'facebookUrl',
          type: 'text',
          label: 'Facebook – povezava',
        },
        {
          name: 'instagramLabel',
          type: 'text',
          label: 'Instagram – besedilo',
          localized: true,
          defaultValue: 'Instagram',
        },
        {
          name: 'instagramUrl',
          type: 'text',
          label: 'Instagram – povezava',
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
}
