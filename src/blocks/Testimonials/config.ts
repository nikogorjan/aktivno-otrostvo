import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  fields: [
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
      name: 'items',
      type: 'array',
      label: 'Testimonials',
      required: true,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'numberOfStars',
          type: 'number',
          label: 'Stars (0–5)',
          min: 0,
          max: 5,
          defaultValue: 5,
          required: true,
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          label: 'Quote',
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
          label: 'Subtitle (e.g., “mamica 3-mesečne punčke”)',
        },
      ],
    },
  ],
}
