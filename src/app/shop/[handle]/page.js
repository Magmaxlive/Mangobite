import { getProduct, getProducts } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import PageBanner from '@/components/common/PageBanner'
import ProductDetail from '@/components/common/ProductDetail'

export const revalidate = 60

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map(p => ({ handle: p.handle }))
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle)
  if (!product) return {}
  return { title: `${product.title} — Mangobite` }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle)
  if (!product) notFound()

  return (
    <div className="flex flex-col">
      <PageBanner
        minorTitle="shop"
        title={product.title}
        description=""
        breadCrumbs={[{ label: 'shop', href: '/shop' }, { label: product.title }]}
      />
      <ProductDetail product={product} />
    </div>
  )
}
