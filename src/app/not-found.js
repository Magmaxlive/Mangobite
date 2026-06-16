import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SectionHeading from '@/components/common/SectionHeading'
import ProductCard from '@/components/common/ProductCard'
import { getProducts } from '@/lib/shopify'
import { sortProductsByCategory } from '@/config/productOrder'

export default async function NotFound() {

      const raw = await getProducts()
      const products = sortProductsByCategory(raw).slice(0,4)
  return (
    <>
    <div
      className={`relative pt-30 pb-18 tablet:pt-30 pb-18 px-8 bg-banner bg-banner bg-cover bg-no-repeat bg-center overflow-hidden`}
    >
      <Image
        src="/images/leaf_left.png"
        alt=""
        width={300}
        height={300}
        className="absolute left-0 top-0 w-36 md:w-52 lg:w-72 opacity-90 pointer-events-none select-none z-0"
      />
      <Image
        src="/images/leaf_right.png"
        alt=""
        width={300}
        height={300}
        className="absolute right-0 top-0 w-36 md:w-52 lg:w-72 opacity-90 pointer-events-none select-none z-0"
      />

      <div className="relative z-10 flex flex-col gap-6 text-center justify-center items-center max-w-7xl mx-auto">

        {/* Title */}
        <h5 className="uppercase text-grayText text-xs tracking-widest">
            mangobite
        </h5>
        <h1 className={` font-black capitalize text-white leading-tight uppercase max-w-xl text-6xl tablet:text-8xl`}>
          404
        </h1>

        <p className={`tablet:text-lg text-base font-normal capitalize max-w-xl text-grayText leading-tight `}>
          Sorry, the page you are looking for does not exist.
        </p>

        {/* Decorative line */}
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-secondary/30 rounded-full" />
          <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
          <div className="h-px w-10 bg-secondary/30 rounded-full" />
        </div>

            <div className="flex gap-6 mt-3">
                <Link href='/' className='border-primary border-2 hover:border-secondary hover:bg-secondary capitalize text-white px-3 py-2 font-semibold rounded-full'>Go Home</Link>

            </div>

      </div>
    </div>
    <div className="py-12 px-8">
        <div className="flex flex-col gap-12 max-w-7xl mx-auto">
            <SectionHeading mainHeading='Shop Fresh Mangoes' />
            <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full">
                  {products.length === 0 ? (
                    <p className="text-center text-gray-400 py-20">No products available right now.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
                      {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}

                  <Link href='/shop' className='px-6 py-2 rounded-sm self-center hover:bg-banner  font-semibold w-fit bg-primary text-white'>View All</Link>



          </div>
        </div>
    </div>
    </>
    
  )
}