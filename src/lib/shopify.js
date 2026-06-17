import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2025-07',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  customFetchApi: (url, init) => {
    // Inject a timestamp comment into the GraphQL query body so every request
    // has a unique POST body, busting Shopify's CDN cache (keyed on body hash).
    let patchedInit = init
    if (init?.body) {
      try {
        const parsed = JSON.parse(init.body)
        if (parsed.query) {
          parsed.query = `# ${Date.now()}\n${parsed.query}`
          patchedInit = { ...init, body: JSON.stringify(parsed) }
        }
      } catch {}
    }
    return fetch(url, { ...patchedInit, cache: 'no-store' })
  },
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
          images(first: 1) {
            edges { node { url altText width height } }
          }
          media(first: 1) {
            edges {
              node {
                mediaContentType
                ... on Video {
                  sources { url mimeType format }
                  previewImage { url }
                }
                ... on MediaImage {
                  image { url altText width height }
                }
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
                currentlyNotInStock
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
          metafield(namespace: "custom", key: "unlimited_stock") { value }
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
        media(first: 10) {
          edges {
            node {
              mediaContentType
              ... on Video {
                sources { url mimeType format }
                previewImage { url }
              }
              ... on MediaImage {
                image { url altText width height }
              }
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              quantityAvailable
              currentlyNotInStock
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              selectedOptions { name value }
            }
          }
        }
        options { id name values }
        metafield(namespace: "custom", key: "unlimited_stock") { value }
      }
    }
  `
  const { data, errors } = await client.request(query, { variables: { handle } })
  if (errors) { console.error('getProduct error:', errors); return null }
  return data?.product ? normalizeProduct(data.product) : null
}

function normalizeMediaItem(node) {
  if (node.mediaContentType === 'VIDEO') {
    const mp4 = node.sources?.find(s => s.mimeType === 'video/mp4' || s.format === 'mp4') ?? node.sources?.[0]
    return { type: 'video', videoUrl: mp4?.url ?? '', previewUrl: node.previewImage?.url ?? '' }
  }
  return {
    type: 'image',
    url: node.image?.url ?? '',
    altText: node.image?.altText ?? '',
    width: node.image?.width ?? 800,
    height: node.image?.height ?? 800,
  }
}

function normalizeProduct(node) {
  const media = node.media?.edges?.map(({ node: m }) => normalizeMediaItem(m)) ?? []
  const fallbackImage = node.images?.edges?.[0]?.node
  if (media.length === 0 && fallbackImage) {
    media.push({ type: 'image', url: fallbackImage.url, altText: fallbackImage.altText ?? '', width: fallbackImage.width ?? 800, height: fallbackImage.height ?? 800 })
  }
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    descriptionHtml: node.descriptionHtml,
    price: node.priceRange?.minVariantPrice,
    media,
    images: media.filter(m => m.type === 'image'),
    variants: node.variants?.edges?.map(({ node: v }) => v) ?? [],
    options: node.options ?? [],
    unlimited: node.metafield?.value === 'true',
  }
}

export async function getVariantAvailability(variantId) {
  const query = `
    query GetVariant($id: ID!) {
      node(id: $id) {
        ... on ProductVariant {
          availableForSale
          quantityAvailable
          currentlyNotInStock
        }
      }
    }
  `
  const { data, errors } = await client.request(query, { variables: { id: variantId } })
  if (errors) return null
  return data?.node ?? null
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
        userErrors { field message }
      }
    }
    ${LINE_FRAGMENT}
  `
  const { data, errors } = await client.request(mutation, { variables: { cartId, lines } })
  if (errors) { console.error('addToCart error:', errors); return { cart: null, userErrors: [] } }
  return {
    cart: normalizeCart(data?.cartLinesAdd?.cart),
    userErrors: data?.cartLinesAdd?.userErrors ?? [],
  }
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
        userErrors { field message }
      }
    }
    ${LINE_FRAGMENT}
  `
  const { data, errors } = await client.request(mutation, { variables: { cartId, lines } })
  if (errors) { console.error('updateCartLine error:', errors); return { cart: null, userErrors: [] } }
  return {
    cart: normalizeCart(data?.cartLinesUpdate?.cart),
    userErrors: data?.cartLinesUpdate?.userErrors ?? [],
  }
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
        quantityAvailable
        currentlyNotInStock
        price { amount currencyCode }
        product {
          title
          handle
          images(first: 1) { edges { node { url altText } } }
          metafield(namespace: "custom", key: "unlimited_stock") { value }
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
    lines: cart.lines?.edges?.filter(({ node }) => node.quantity > 0).map(({ node }) => ({
      id: node.id,
      quantity: node.quantity,
      variantId: node.merchandise?.id,
      variantTitle: node.merchandise?.title,
      price: node.merchandise?.price,
      quantityAvailable: node.merchandise?.quantityAvailable ?? null,
      currentlyNotInStock: node.merchandise?.currentlyNotInStock ?? false,
      unlimited: node.merchandise?.product?.metafield?.value === 'true',
      product: {
        title: node.merchandise?.product?.title,
        handle: node.merchandise?.product?.handle,
        image: node.merchandise?.product?.images?.edges?.[0]?.node,
      },
    })) ?? [],
    total: cart.cost?.totalAmount,
  }
}

// ─── Blogs ────────────────────────────────────────────────────────────────────

export async function getArticles() {
  const query = `{
    articles(first: 50, sortKey: PUBLISHED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          excerpt
          publishedAt
          image { url altText width height }
          author { name }
          blog { handle title }
          tags
        }
      }
    }
  }`
  const { data, errors } = await client.request(query)
  if (errors) { console.error('getArticles error:', errors); return [] }
  return data?.articles?.edges?.map(({ node }) => node) ?? []
}

export async function getArticle(blogHandle, articleHandle) {
  const query = `
    query GetArticle($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        articleByHandle(handle: $articleHandle) {
          id
          title
          handle
          contentHtml
          excerpt
          publishedAt
          image { url altText width height }
          author { name }
          tags
        }
      }
    }
  `
  const { data, errors } = await client.request(query, { variables: { blogHandle, articleHandle } })
  if (errors) { console.error('getArticle error:', errors); return null }
  return data?.blog?.articleByHandle ?? null
}

export async function searchProducts(query) {
  if (!query?.trim()) return []
  const gql = `
    query PredictiveSearch($query: String!) {
      predictiveSearch(query: $query, types: [PRODUCT], limit: 8) {
        products {
          id
          title
          handle
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 1) { edges { node { url altText } } }
          variants(first: 1) { edges { node { availableForSale } } }
        }
      }
    }
  `
  const { data, errors } = await client.request(gql, { variables: { query } })
  if (errors) { console.error('searchProducts error:', errors); return [] }
  return (data?.predictiveSearch?.products ?? []).map(p => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    price: p.priceRange?.minVariantPrice,
    image: p.images?.edges?.[0]?.node,
    available: p.variants?.edges?.[0]?.node?.availableForSale ?? false,
  }))
}

export async function getOfferBanners() {
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

  const { data, errors } = await client.request(query)
  if (errors) { console.error('getOfferBanners error:', errors); return [] }

  return (
    data?.metaobjects?.edges?.map(({ node }) => {
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
    }).filter(b => b.image) ?? []
  )
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
