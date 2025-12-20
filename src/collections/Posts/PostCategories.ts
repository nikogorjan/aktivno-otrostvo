import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

export const PostCategories: CollectionConfig = {
  slug: 'postCategories',
  access: { read: () => true },
  admin: { useAsTitle: 'title' },

  defaultPopulate: {
    title: true,
    slug: true,
  },

  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField({ position: undefined }),
  ],
}
