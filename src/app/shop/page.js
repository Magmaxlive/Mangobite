import { getProducts } from '@/lib/shopify'
import PageBanner from '@/components/common/PageBanner'
import ProductCard from '@/components/common/ProductCard'

export const revalidate = 60

export default async function ShopPage() {
  const raw = await getProducts()
  const products = [...raw].sort((a, b) => {
    const aIn = a.variants.some(v => v.availableForSale)
    const bIn = b.variants.some(v => v.availableForSale)
    return aIn === bIn ? 0 : aIn ? -1 : 1
  })

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
