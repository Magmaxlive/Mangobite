// app/robots.js

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/cart',
        '/checkout',
        '/account',
        '/order-success',
        '/search',
        '/*?sort=',
        '/*?filter=',
        '/*?min_price=',
        '/*?max_price=',
        '/*?rating=',
        '/*?q=',
        '/*?add-to-cart=',
      ],
    },
    sitemap: 'https://mangobite.co.nz/sitemap.xml',
  }
}