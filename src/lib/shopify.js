import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2024-10',
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
})

export async function getGalleryImages() {
  const query = `{
    metaobjects(type: "gallery", first: 50) {
      edges {
        node {
          id
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }`

  const { data, errors } = await client.request(query)

  if (errors) {
    console.error('Shopify gallery fetch error:', errors)
    return []
  }

  return (
    data?.metaobjects?.edges
      ?.map(({ node }) => {
        const imageField = node.fields.find(f => f.key === 'image')
        return {
          id: node.id,
          url: imageField?.reference?.image?.url,
          altText: imageField?.reference?.image?.altText || '',
          width: imageField?.reference?.image?.width || 800,
          height: imageField?.reference?.image?.height || 800,
        }
      })
      .filter(item => item.url) || []
  )
}
