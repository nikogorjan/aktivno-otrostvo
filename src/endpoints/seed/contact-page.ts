import type { Form } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type ProductArgs = {
  contactForm: Form
}

export const contactPageData: (
  args: ProductArgs,
) => RequiredDataFromCollectionSlug<'pages'> = ({ contactForm }) => {
  return {
    slug: 'contact',
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockType: 'formBlock',
        form: contactForm,
        // 👇 required by your new FormBlock config
        title: 'Contact',

        // 👇 this replaces the old `introContent`
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Example contact form:',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                tag: 'h3',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },

        // optional – only if you want to seed default contact info:
        // contactInfo: {
        //   email: 'info@example.com',
        //   phone: '+386 40 000 000',
        //   facebookLabel: 'Facebook',
        //   facebookUrl: 'https://facebook.com/...',
        //   instagramLabel: 'Instagram',
        //   instagramUrl: 'https://instagram.com/...',
        // },
      },
    ],
    title: 'Contact',
  }
}
