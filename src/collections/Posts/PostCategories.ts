import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

export const PostCategories: CollectionConfig = {
  slug: 'postCategories',
  labels: {
        singular: 'Kategorija blog objave',
        plural: 'Kategorije blog objav',
    },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true
    },
    slugField({
      position: undefined,
    }),
  ],
}
