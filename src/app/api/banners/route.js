import { NextResponse } from 'next/server'

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

export async function GET() {
  const query = `{
    metaobjects(type: "offer_banner", first: 10) {
      edges {
        node {
          id
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image { url altText width height }
              }
              ... on Product {
                handle
                title
              }
            }
          }
        }
      }
    }
  }`

  try {
    const res = await fetch(
      `https://${STORE_DOMAIN}/api/2025-07/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': TOKEN,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
        body: JSON.stringify({ query: `# ${Date.now()}\n${query}` }),
        cache: 'no-store',
      }
    )

    const json = await res.json()
    const edges = json?.data?.metaobjects?.edges ?? []

    const banners = edges
      .map(({ node }) => {
        const field = (key) => node.fields.find(f => f.key === key)
        const imageField = field('banner')
        const productField = field('product')
        return {
          id: node.id,
          title: field('offer_text')?.value ?? null,
          productHandle: productField?.reference?.handle ?? null,
          productTitle: productField?.reference?.title ?? null,
          image: imageField?.reference?.image ?? null,
        }
      })
      .filter(b => b.image)

    return NextResponse.json(banners, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
  } catch (err) {
    console.error('banners API error:', err)
    return NextResponse.json([], { status: 500 })
  }
}
