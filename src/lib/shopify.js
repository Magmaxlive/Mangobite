import { createStorefrontApiClient } from '@shopify/storefront-api-client'

// ─── Storefront API client (cart operations only) ─────────────────────────────

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2025-07',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  customFetchApi: (url, init) => fetch(url, { ...init, cache: 'no-store' }),
})

// ─── Admin API client (products, blogs, metaobjects — no CDN cache) ───────────

let _adminToken = null
let _adminTokenExpiry = 0

async function getAdminToken() {
  if (_adminToken && Date.now() < _adminTokenExpiry) return _adminToken
  const res = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      }),
      cache: 'no-store',
    }
  )
  const data = await res.json()
  _adminToken = data.access_token
  _adminTokenExpiry = Date.now() + (data.expires_in - 300) * 1000
  return _adminToken
}

async function adminRequest(query, variables = {}) {
  const token = await getAdminToken()
  const res = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    }
  )
  return res.json()
}

// ─── Products ─────────────────────────────────────────────────────────────────

const ADMIN_PRODUCT_FIELDS = `
  id
  title
  handle
  descriptionHtml
  status
  options { id name values }
  metafield(namespace: "custom", key: "unlimited_stock") { value }
  images(first: 1) { edges { node { url altText width height } } }
  media(first: 10) {
    edges {
      node {
        mediaContentType
        ... on Video {
          sources { url mimeType format }
          preview { image { url } }
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
        inventoryPolicy
        inventoryQuantity
        inventoryItem { tracked }
        price
        compareAtPrice
        selectedOptions { name value }
      }
    }
  }
`

export async function getProducts() {
  const query = `{ products(first: 50, query: "status:active") { edges { node { ${ADMIN_PRODUCT_FIELDS} } } } }`
  const { data, errors } = await adminRequest(query)
  if (errors) { console.error('getProducts error:', errors); return [] }
  return data?.products?.edges?.map(({ node }) => normalizeAdminProduct(node)) ?? []
}

export async function getProduct(handle) {
  const query = `
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) { ${ADMIN_PRODUCT_FIELDS} }
    }
  `
  const { data, errors } = await adminRequest(query, { handle })
  if (errors) { console.error('getProduct error:', errors); return null }
  const node = data?.productByHandle
  if (!node || node.status !== 'ACTIVE') return null
  return normalizeAdminProduct(node)
}

function normalizeAdminMediaItem(node) {
  if (node.mediaContentType === 'VIDEO') {
    const mp4 = node.sources?.find(s => s.mimeType === 'video/mp4' || s.format === 'mp4') ?? node.sources?.[0]
    return { type: 'video', videoUrl: mp4?.url ?? '', previewUrl: node.preview?.image?.url ?? '' }
  }
  return {
    type: 'image',
    url: node.image?.url ?? '',
    altText: node.image?.altText ?? '',
    width: node.image?.width ?? 800,
    height: node.image?.height ?? 800,
  }
}

function normalizeAdminVariant(v) {
  const tracked = v.inventoryItem?.tracked ?? true
  const oversell = v.inventoryPolicy === 'CONTINUE'
  const qty = v.inventoryQuantity ?? 0
  // Not tracked = always available (like unlimited stock)
  const availableForSale = !tracked || oversell || qty > 0
  const quantityAvailable = tracked ? qty : null
  const currentlyNotInStock = tracked && oversell && qty <= 0
  return {
    id: v.id,
    title: v.title,
    availableForSale,
    quantityAvailable,
    currentlyNotInStock,
    price: { amount: v.price, currencyCode: 'NZD' },
    compareAtPrice: v.compareAtPrice ? { amount: v.compareAtPrice, currencyCode: 'NZD' } : null,
    selectedOptions: v.selectedOptions,
  }
}

function normalizeAdminProduct(node) {
  if (!node) return null
  const media = node.media?.edges?.map(({ node: m }) => normalizeAdminMediaItem(m)) ?? []
  const fallbackImage = node.images?.edges?.[0]?.node
  if (media.length === 0 && fallbackImage) {
    media.push({ type: 'image', url: fallbackImage.url, altText: fallbackImage.altText ?? '', width: fallbackImage.width ?? 800, height: fallbackImage.height ?? 800 })
  }
  const variants = node.variants?.edges?.map(({ node: v }) => normalizeAdminVariant(v)) ?? []
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    descriptionHtml: node.descriptionHtml,
    price: variants[0]?.price ?? { amount: '0', currencyCode: 'NZD' },
    media,
    images: media.filter(m => m.type === 'image'),
    variants,
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
          body
          publishedAt
          image { url altText width height }
          author { name }
          blog { handle title }
          tags
        }
      }
    }
  }`
  const { data, errors } = await adminRequest(query)
  if (errors) { console.error('getArticles error:', errors); return [] }
  return (data?.articles?.edges?.map(({ node }) => ({
    ...node,
    excerpt: node.body?.replace(/<[^>]*>/g, '').slice(0, 160) ?? '',
    author: node.author,
  })) ?? [])
}

export async function getArticle(blogHandle, articleHandle) {
  const query = `
    query GetArticle($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        articleByHandle(handle: $articleHandle) {
          id
          title
          handle
          body
          publishedAt
          image { url altText width height }
          author { name }
          tags
        }
      }
    }
  `
  const { data, errors } = await adminRequest(query, { blogHandle, articleHandle })
  if (errors) { console.error('getArticle error:', errors); return null }
  const node = data?.blog?.articleByHandle
  if (!node) return null
  return { ...node, contentHtml: node.body, excerpt: node.body?.replace(/<[^>]*>/g, '').slice(0, 160) ?? '', author: node.author }
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

// ─── Metaobjects ──────────────────────────────────────────────────────────────

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
              ... on MediaImage { image { url altText width height } }
              ... on Product { handle title }
            }
          }
        }
      }
    }
  }`
  const { data, errors } = await adminRequest(query)
  if (errors) { console.error('getOfferBanners error:', errors); return [] }
  return (data?.metaobjects?.edges?.map(({ node }) => {
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
  }).filter(b => b.image) ?? [])
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
              ... on MediaImage { image { url altText width height } }
            }
          }
        }
      }
    }
  }`
  const { data, errors } = await adminRequest(query)
  if (errors) { console.error('getGalleryImages error:', errors); return [] }
  return (data?.metaobjects?.edges?.map(({ node }) => {
    const imageField = node.fields.find(f => f.key === 'image')
    return {
      id: node.id,
      url: imageField?.reference?.image?.url,
      altText: imageField?.reference?.image?.altText || '',
      width: imageField?.reference?.image?.width || 800,
      height: imageField?.reference?.image?.height || 800,
    }
  }).filter(item => item.url) ?? [])
}
