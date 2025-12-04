import type { Block } from 'payload'

export const CtaEmail: Block = {
  slug: 'ctaEmail',
  interfaceName: 'CtaEmailBlock',
  labels: { singular: 'CTA Email', plural: 'CTA Email Sections' },
  fields: [
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
      label: 'Show bottom-right decorative SVG',
      defaultValue: true,
    },
    {
      name: 'action',
      type: 'text',
      label: 'Form action URL (optional)',
    },
    {
      name: 'successRedirect',
      type: 'text',
      label: 'Success redirect URL (optional)',
    },
    {
      name: 'honeypotName',
      type: 'text',
      label: 'Honeypot field name (optional)',
    },
  ],
}
