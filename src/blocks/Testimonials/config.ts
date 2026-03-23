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
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/testimonials.png`
  }
  return FALLBACK_THUMB
}

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Mnenja', plural: 'Mnenja' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Naslov',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
      localized: true,

    },
    {
      name: 'items',
      type: 'array',
      label: 'Pričevanja',
      required: true,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'numberOfStars',
          type: 'number',
          label: 'Zvezdice (0–5)',
          min: 0,
          max: 5,
          defaultValue: 5,
          required: true,
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          label: 'Pričevanje',
                localized: true,

        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Avatar',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Podnaslov (e.g., “mamica 3-mesečne punčke”)',
        },
      ],
    },
  ],
}
