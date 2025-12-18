import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

const rich = () =>
    lexicalEditor({
        features: ({ rootFeatures }) => [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
        ],
    })

export const ProgramCategories: CollectionConfig = {
    slug: 'programCategories',
    labels: {
        singular: 'Program',
        plural: 'Programi',
    },
    access: { read: () => true },
    admin: {
        useAsTitle: 'title',
        group: 'Content',
        defaultColumns: ['title', 'slug', 'order'],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
        },
        slugField({
            position: undefined,
        }),
        {
            name: 'backgroundColor',
            type: 'select',
            label: 'Barva programa',
            defaultValue: 'modra',
            required: true,
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
            name: 'icon',
            label: 'Ikona',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: 'Video ali slika',
        },
        {
            name: 'description',
            type: 'richText',
            editor: rich(),
            label: 'opis',
            localized: true
        },
         {
            name: 'lessons',
            label: 'Lekcije',
            type: 'join',
            collection: 'lessons',
            on: 'program', 
            admin: {
                allowCreate: false,
                defaultColumns: ['title', 'comingSoon'],
            },
        },

    ],
}
