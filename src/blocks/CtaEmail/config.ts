import type { Block } from 'payload'

export const CtaEmail: Block = {
  slug: 'ctaEmail',
  interfaceName: 'CtaEmailBlock',
  labels: { singular: 'CTA Email', plural: 'CTA Email Sections' },
  fields: [
    {
      name: 'image',
      label: 'Left Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'inputPlaceholder',
          type: 'text',
          label: 'Input Placeholder',
          defaultValue: 'Vpiši e-naslov',
          admin: { width: '50%' },
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Prijava',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'legalNote',
      type: 'text',
      label: 'Legal Note',
      defaultValue: 'Z klikom na gumb se strinjate s pogoji poslovanja.',
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
