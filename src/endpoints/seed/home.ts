import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ProductArgs = {
  metaImage: Media
  contentImage: Media
}

export const homePageData: (args: ProductArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
  contentImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    title: 'Home',
    hero: {
      type: 'lowImpact',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'All products',
            url: '/search',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Contact',
            url: '/contact',
          },
        },
      ],
      richText: {
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
                  text: 'Payload Ecommerce Template',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h1',
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'link',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Visit the admin dashboard',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  fields: {
                    linkType: 'custom',
                    newTab: false,
                    url: '/admin',
                  },
                  format: '',
                  indent: 0,
                  version: 3,
                },
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: " to begin managing this site's content.",
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    layout: [
      {
        blockName: 'Intro Video',
        blockType: 'videoSection',
        heading: 'Discover the store experience',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Showcase your products, explain your offer, and guide visitors through the most important parts of your website.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Browse products',
              url: '/products',
            },
          },
        ],
        backgroundColor: 'modra',
        mediaTitle: 'A simple way to present your products',
        browserUrl: 'aktivno-otrostvo.com',
        media: contentImage,
      },
      {
        blockName: 'Call to Action Background',
        blockType: 'ctaBackgroundSection',
        heading: 'Ready to get started?',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Use the admin dashboard to create pages, manage products, and customize your website content.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Open admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'View products',
              url: '/products',
            },
          },
        ],
        backgroundImage: contentImage,
      },
    ],
    meta: {
      description: 'An open-source ecommerce site built with Payload and Next.js.',
      image: metaImage,
      title: 'Payload Ecommerce Template',
    },
  }
}