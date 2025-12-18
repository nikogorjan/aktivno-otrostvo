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

export const Lessons: CollectionConfig = {
    slug: 'lessons',
    labels: {
        singular: 'Lekcija',
        plural: 'Lekcije',
    },
    access: { read: () => true },
    admin: {
        useAsTitle: 'title',
        group: 'Content',
        defaultColumns: ['title', 'program', 'comingSoon'],
    },
    fields: [
        {
            name: 'title',
            label: 'Naslov',
            type: 'text',
            required: true,
            localized: true,
        },

        slugField({ position: undefined }),

        {
            name: 'program',
            label: 'Program',
            type: 'relationship',
            relationTo: 'programCategories',
            required: true,
            index: true,
        },

        {
            name: 'media',
            label: 'Video ali slika',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },

        {
            name: 'description',
            label: 'Opis',
            type: 'richText',
            editor: rich(),
            localized: true,
        },
       
        {
            name: 'comingSoon',
            label: 'Kmalu na voljo',
            type: 'radio',
            required: true,
            defaultValue: 'no',
            options: [
                { label: 'Ne', value: 'no' },
                { label: 'Da', value: 'yes' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
    ],
}
