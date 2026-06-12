// app/sitemap.js

const BASE_URL = 'https://mangobite.co.nz'

export default function sitemap() {
  const staticPages = [
    { path: '/', priority: 1.0 },
    { path: '/shop/', priority: 0.9 },
    { path: '/my-mango-story/', priority: 0.8 },
    { path: '/mango-journey/', priority: 0.8 },
    { path: '/health-bites/', priority: 0.8 },
    { path: '/mangopedia/', priority: 0.8 },
    { path: '/contact/', priority: 0.7 },
    { path: '/disclaimer/', priority: 0.3 },
    { path: '/refund-policy/', priority: 0.3 },
  ]

  const products = [
    { slug: 'alphonso-mango', priority: 0.9 },
    { slug: 'kesar-mango', priority: 0.9 },
    { slug: 'banganapali-badami-mango', priority: 0.9 },
    { slug: 'langda-mango', priority: 0.9 },
    { slug: 'chaunsa-mango', priority: 0.9 },
    { slug: 'dusheri-mango', priority: 0.9 },
    { slug: 'kesar-twin-box-deal', priority: 0.8 },
    { slug: 'neelam-mango', priority: 0.9 },
    { slug: 'rajapuri-mango', priority: 0.9 },
    { slug: 'totapuri-mango', priority: 0.9 },
    { slug: 'cheruku-rasalu-mango', priority: 0.9 },
    { slug: 'payri-mango', priority: 0.9 },
    { slug: 'mallika-mango', priority: 0.9 },
    { slug: 'green-sour-mango', priority: 0.8 },
    { slug: 'totapuri-raw-green-mango', priority: 0.8 },
    { slug: 'himayat', priority: 0.9 },
    { slug: 'tella-gulabeelu-pickle-green-mango', priority: 0.8 },
    { slug: 'amrapalli-mango', priority: 0.9 },
    { slug: 'sindhura', priority: 0.9 },
    { slug: 'pedda-rasallu-mango', priority: 0.9 },
    { slug: 'avakai-pickle-green-mango', priority: 0.8 },
  ]

  return [
    ...staticPages.map((page) => ({
      url: `${BASE_URL}${page.path}`,
      priority: page.priority,
    })),
    ...products.map((product) => ({
      url: `${BASE_URL}/product/${product.slug}/`,
      priority: product.priority,
    })),
  ]
}