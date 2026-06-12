import { getProducts } from '@/lib/shopify'
import PageBanner from '@/components/common/PageBanner'
import ProductCard from '@/components/common/ProductCard'

export const revalidate = 0

export const metadata = {
  title: 'Shop Fresh Indian Mangoes Online in New Zealand, Mango Bite',
  description: "Browse Mango Bite's online store for a variety of fresh Indian mangoes, including Alphonso, Banganapalli, and Kesar, available for delivery across New Zealand",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
};

export default async function ShopPage() {
  const raw = await getProducts()
  const productStatus = (p) => {
    if (p.variants.some(v => v.availableForSale && !v.currentlyNotInStock)) return 0
    if (p.variants.some(v => v.availableForSale)) return 1
    return 2
  }
  const products = [...raw].sort((a, b) => productStatus(a) - productStatus(b))

  return (
    <div className="flex flex-col">
      <PageBanner
        minorTitle="fresh from the farm"
        title="Shop"
        description="Order premium Indian mangoes, delivered to your door."
        breadCrumbs={[{ label: 'shop' }]}
      />

      <div className="py-14 px-8 max-w-7xl mx-auto w-full">
        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No products available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      
    </div>
  )
}
