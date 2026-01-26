import type { Block } from 'payload'

export const ZoomMeetingCard: Block = {
  slug: 'zoomMeetingCard',
  interfaceName: 'ZoomMeetingCardBlock',
  labels: { singular: 'Zoom Meeting Card', plural: 'Zoom Meeting Cards' },
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
      label: 'Zoom link (manual)',
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
          label: 'Honeypot field name (optional)',
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
          label: 'Show terms checkbox',
          defaultValue: true,
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Require agreement to submit',
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
