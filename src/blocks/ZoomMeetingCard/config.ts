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
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/zoom-meeting-section.webp`
  }
  return FALLBACK_THUMB
}

export const ZoomMeetingCard: Block = {
  slug: 'zoomMeetingCard',
  interfaceName: 'ZoomMeetingCardBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Prijava na zoom predavanje', plural: 'Prijava na zoom predavanja' },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Obrazec (Forms plugin)',
    },
    {
      name: 'image',
      label: 'Slika',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },

    // ✅ manual zoom link pasted by admin
    {
      name: 'zoomLink',
      type: 'text',
      label: 'Zoom link',
      required: true,
      localized: true, // keep true if you want different link per locale
      admin: {
        description:
          'This link will be injected into the submission as field "zoomLink" and can be used in the Forms plugin email template.',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'buttonLabel',
          type: 'text',
          localized: true,
          defaultValue: 'Programi',
          admin: { width: '50%' },
        },
        {
          name: 'honeypotName',
          type: 'text',
          label: 'Honeypot field name',
          admin: { width: '50%' },
        },
      ],
    },

    {
      name: 'terms',
      label: 'Pogoji',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'pokaži pogoje poslovanja',
          defaultValue: true,
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Zahtevaj soglasje za oddajo obrazca',
          defaultValue: true,
          admin: { condition: (_, s) => Boolean(s?.enabled) },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          defaultValue: 'Strinjam se s pogoji',
          admin: { condition: (_, s) => Boolean(s?.enabled) },
        },
      ],
    },

    {
      name: 'showDecoration',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
