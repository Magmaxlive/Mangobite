import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2024-10',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
})

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts() {
  const query = `{
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 5) {
            edges {
              node { url altText width height }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }`

  const { data, errors } = await client.request(query)
  if (errors) { console.error('getProducts error:', errors); return [] }
  return data?.products?.edges?.map(({ node }) => normalizeProduct(node)) ?? []
}

export async function getProduct(handle) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 10) {
          edges {
            node { url altText width height }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              price { amount currencyCode }
              selectedOptions { name value }
            }
          }
        }
        options {
          id name values
        }
      }
    }
  `
  const { data, errors } = await client.request(query, { variables: { handle } })
  if (errors) { console.error('getProduct error:', errors); return null }
  return data?.product ? normalizeProduct(data.product) : null
}

function normalizeProduct(node) {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    descriptionHtml: node.descriptionHtml,
    price: node.priceRange?.minVariantPrice,
    images: node.images?.edges?.map(({ node: img }) => img) ?? [],
    variants: node.variants?.edges?.map(({ node: v }) => v) ?? [],
    options: node.options ?? [],
  }
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function createCart() {
  const mutation = `
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 100) { edges { node { ...LineFields } } }
          cost { totalAmount { amount currencyCode } }
        }
      }
    }
    ${LINE_FRAGMENT}
  `
  const { data, errors } = await client.request(mutation)
  if (errors) { console.error('createCart error:', errors); return null }
  return normalizeCart(data?.cartCreate?.cart)
}

export async function getCart(cartId) {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 100) { edges { node { ...LineFields } } }
        cost { totalAmount { amount currencyCode } }
      }
    }
    ${LINE_FRAGMENT}
  `
  const { data, errors } = await client.request(query, { variables: { cartId } })
  if (errors) { console.error('getCart error:', errors); return null }
  return data?.cart ? normalizeCart(data.cart) : null
}

export async function addToCart(cartId, lines) {
  const mutation = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) { edges { node { ...LineFields } } }
          cost { totalAmount { amount currencyCode } }
        }
      }
    }
    ${LINE_FRAGMENT}
  `
  const { data, errors } = await client.request(mutation, { variables: { cartId, lines } })
  if (errors) { console.error('addToCart error:', errors); return null }
  return normalizeCart(data?.cartLinesAdd?.cart)
}

export async function updateCartLine(cartId, lines) {
  const mutation = `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) { edges { node { ...LineFields } } }
          cost { totalAmount { amount currencyCode } }
        }
      }
    }
    ${LINE_FRAGMENT}
  `
  const { data, errors } = await client.request(mutation, { variables: { cartId, lines } })
  if (errors) { console.error('updateCartLine error:', errors); return null }
  return normalizeCart(data?.cartLinesUpdate?.cart)
}

export async function removeCartLine(cartId, lineIds) {
  const mutation = `
    mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          lines(first: 100) { edges { node { ...LineFields } } }
          cost { totalAmount { amount currencyCode } }
        }
      }
    }
    ${LINE_FRAGMENT}
  `
  const { data, errors } = await client.request(mutation, { variables: { cartId, lineIds } })
  if (errors) { console.error('removeCartLine error:', errors); return null }
  return normalizeCart(data?.cartLinesRemove?.cart)
}

const LINE_FRAGMENT = `
  fragment LineFields on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        price { amount currencyCode }
        product {
          title
          handle
          images(first: 1) { edges { node { url altText } } }
        }
      }
    }
  }
`

function normalizeCart(cart) {
  if (!cart) return null
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: cart.lines?.edges?.map(({ node }) => ({
      id: node.id,
      quantity: node.quantity,
      variantId: node.merchandise?.id,
      variantTitle: node.merchandise?.title,
      price: node.merchandise?.price,
      product: {
        title: node.merchandise?.product?.title,
        handle: node.merchandise?.product?.handle,
        image: node.merchandise?.product?.images?.edges?.[0]?.node,
      },
    })) ?? [],
    total: cart.cost?.totalAmount,
  }
}

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
