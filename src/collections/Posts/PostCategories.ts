import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

export const PostCategories: CollectionConfig = {
  slug: 'postCategories',
  labels: {
    singular: 'Kategorija Objave',
    plural: 'Kategorije Objav',
  },
  access: { read: () => true },
  admin: {
    useAsTitle: 'title', group: {
      sl: 'Za navdih',
    },
  },

  defaultPopulate: {
    title: true,
    slug: true,
  },

  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField({ position: undefined }),
  ],
}
