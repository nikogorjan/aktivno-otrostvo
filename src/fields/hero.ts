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
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Main photo',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: 'Main title (e.g. "AKTIVNO OTROŠTVO")',
        },
  
      ],
    },

    {
      name: 'right',
      type: 'group',
      label: 'HomeHero • Grid',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
      },
      fields: [
        {
          name: 'cards',
          type: 'blocks',
          label: 'Info cards (order matters – 7 items)',
          minRows: 7,
          maxRows: 7,
          blocks: [
            {
              slug: 'infoCard',
              labels: { singular: 'Info Card', plural: 'Info Cards' },
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media', label: 'Icon' },
                { name: 'heading', type: 'text', required: true, label: 'Heading' },
                { name: 'body', type: 'textarea', label: 'Description (optional)' },
                {
                  name: 'color',
                  type: 'select',
                  defaultValue: 'roza',
                  label: 'Background Color',
                  options: [
                    { label: 'Roza (pink)', value: 'roza' },
                    { label: 'Oranžna (peach)', value: 'oranzna' },
                    { label: 'Rumena (yellow)', value: 'rumena' },
                    { label: 'Zelena (green)', value: 'zelena' },
                    { label: 'Vijolična (purple)', value: 'vijolicna' },
                    { label: 'Modra (blue)', value: 'modra' },
                    { label: 'Mint (light green)', value: 'mint' },
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
}
