// src/fields/hero.ts  (or ./linkGroup sibling)
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Field } from 'payload'
import { linkGroup } from './linkGroup'

const rich = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const hero: Field = {
  name: 'hero',
  type: 'group',
  label: false,
  fields: [
    // SELECT TYPE
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Home Hero', value: 'homeHero' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
      ],
      required: true,
    },

    // SHARED / EXISTING FIELDS (conditionally shown where used)
    {
      name: 'richText',
      type: 'richText',
      editor: rich(),
      label: false,
      admin: {
        // show for existing hero types, hide for homeHero
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'lowImpact'].includes(type as string),
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) =>
            ['highImpact', 'mediumImpact', 'lowImpact'].includes(type as string),
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type as string),
      },
    },

    // --- HOMEPAGE HERO FIELDS (only when type === 'homeHero') ---
    {
      name: 'left',
      type: 'group',
      label: 'HomeHero • Left',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
      },
      fields: [
        { name: 'tagline', type: 'text', label: 'Tagline' },
        { name: 'stars', type: 'number', min: 0, max: 5, defaultValue: 5, label: 'Stars (0–5)' },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
        },
        linkGroup({
          overrides: { maxRows: 1, admin: { description: 'Primary CTA' } },
        }),
      ],
    },
    {
      name: 'right',
      type: 'group',
      label: 'HomeHero • Right Grid',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
      },
      fields: [
        {
          name: 'columns',
          type: 'array',
          label: 'Columns',
          minRows: 3,
          maxRows: 3,
          fields: [
            {
              name: 'cards',
              type: 'blocks',
              minRows: 1,
              maxRows: 2,
              blocks: [
                {
                  slug: 'imageCard',
                  labels: { singular: 'Image Card', plural: 'Image Cards' },
                  fields: [
                    {
                      name: 'media',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      label: 'Image',
                    },
                    { name: 'badge', type: 'text', label: 'Badge text (overlay)' },
                    { name: 'badgeIcon', type: 'upload', relationTo: 'media', label: 'Badge icon' },
                    {
                      name: 'href',
                      type: 'text',
                      label: 'Link URL (optional)',
                      admin: {
                        description: 'Enter URL to make entire card clickable',
                      },
                    },
                  ],
                },
                {
                  slug: 'infoCard',
                  labels: { singular: 'Info Card', plural: 'Info Cards' },
                  fields: [
                    { name: 'icon', type: 'upload', relationTo: 'media', label: 'Icon' },
                    { name: 'heading', type: 'text', required: true, label: 'Heading' },
                    { name: 'body', type: 'textarea', label: 'Description' },
                    // NEW: Color select
                    {
                      name: 'color',
                      type: 'select',
                      defaultValue: 'roza',
                      label: 'Background Color',
                      options: [
                        { label: 'Roza (Pink)', value: 'roza' },
                        { label: 'Rumena (Yellow)', value: 'rumena' },
                        { label: 'Modra (Blue)', value: 'modra' },
                      ],
                    },
                    {
                      name: 'href',
                      type: 'text',
                      label: 'Link URL (optional)',
                      admin: {
                        description: 'Enter URL to make entire card clickable',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
