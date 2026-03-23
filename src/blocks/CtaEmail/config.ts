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
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/e-novice.webp`
  }
  return FALLBACK_THUMB
}

export const CtaEmail: Block = {
  slug: 'ctaEmail',
  interfaceName: 'CtaEmailBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Prijava na e-novice', plural: 'Prijave na e-novice' },
  fields: [
    // ✅ pick a form (Payload Forms plugin)
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
      type: 'row',
      fields: [
        {
          name: 'inputPlaceholder',
          type: 'text',
          label: 'Besedilo v prijavni vrstici',
          defaultValue: 'Vpiši e-naslov',
          admin: { width: '50%' },
          localized: true,
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Napis v gumbu',
          defaultValue: 'Prijava',
          admin: { width: '50%' },
          localized: true,
        },
      ],
    },
    {
      name: 'legalNote',
      type: 'text',
      label: 'Sporočilo - pogoji poslovanja',
      defaultValue: 'Z klikom na gumb se strinjate s pogoji poslovanja.',
      localized: true,
    },
    {
      name: 'showDecoration',
      type: 'checkbox',
      label: 'Pokaži žogico za dekoracijo',
      defaultValue: true,
    },
    {
      name: 'action',
      type: 'text',
      label: 'URL za gumb (če ne uporabljate Forms plugin obrazca)',
    },
    {
      name: 'successRedirect',
      type: 'text',
      label: 'URL za preusmeritev po uspešni prijavi (optional)',
    },
    {
      name: 'honeypotName',
      type: 'text',
      label: 'Ime polja za Honeypot (optional)',
    },

    // ✅ keep MailerLite config as you already have it
    {
      name: 'mailerLite',
      label: 'MailerLite',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Omogoči prijavo na MailerLite',
          defaultValue: true,
        },
        {
          name: 'groupId',
          type: 'text',
          label: 'MailerLite Group ID',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
            description: 'Subscribers will be added to this group',
          },
        },
        {
          name: 'doubleOptIn',
          type: 'checkbox',
          label: 'Zahtevaj dvojno potrditev',
          defaultValue: true,
        },
      ],
    },
  ],
}
