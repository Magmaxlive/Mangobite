export const dynamic = 'force-dynamic'

import { getProducts } from '@/lib/shopify'
import PageBanner from '@/components/common/PageBanner'
import ProductCard from '@/components/common/ProductCard'
import { groupProductsByCategory } from '@/config/productOrder'

export const metadata = {
  title: 'Shop Fresh Indian Mangoes Online in New Zealand, Mango Bite',
  description: "Browse Mango Bite's online store for a variety of fresh Indian mangoes, including Alphonso, Banganapalli, and Kesar, available for delivery across New Zealand",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
};

export default async function ShopPage() {
  const raw = await getProducts()
  const groups = groupProductsByCategory(raw)

  return (
    <div className="flex flex-col">
      <PageBanner
        minorTitle="fresh from the farm"
        title="Shop"
        description="Order premium Indian mangoes, delivered to your door."
        breadCrumbs={[{ label: 'shop' }]}
      />

      <div className="py-14 px-8 max-w-7xl mx-auto w-full flex flex-col gap-14">
        {groups.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No products available right now.</p>
        ) : (
          groups.map(group => (
            <section key={group.label}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-base font-black uppercase tracking-widest text-gray-700 whitespace-nowrap">
                  {group.label}
                </h2>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
                {group.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
