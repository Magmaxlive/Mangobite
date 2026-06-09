export const revalidate = 0

import HeroSlider from '@/components/common/HeroSlider'
import SectionHeading from '@/components/common/SectionHeading'
import { getProducts } from '@/lib/shopify'
import ProductCard from '@/components/common/ProductCard'
import MangoCarousel from '@/components/common/MangoCarousel'
import Link from 'next/link'
import Image from 'next/image'
import Testimonials from '@/components/common/Testimonials'
import Cards from '@/components/common/Cards'


export const metadata = {
  title: 'Buy Fresh Mangoes Online in New Zealand, Mango Bite',
  description: 'Leading Fresh Mango Exporter in Auckland, NZ Mango Bite, offers a wide range of fresh Indian mangoes. Order online or visit our New Zealand store.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
};


export default async function Home() {

  const raw = await getProducts()
  const products = [...raw].sort((a, b) => {
    const aIn = a.variants.some(v => v.availableForSale)
    const bIn = b.variants.some(v => v.availableForSale)
    return aIn === bIn ? 0 : aIn ? -1 : 1
  }).slice(0,8)

  return (
    <div>
      <HeroSlider />

      <div className="pb-12 pt-15 px-8">
        <div className="flex flex-col max-w-7xl mx-auto gap-12">
          <SectionHeading mainHeading='premium mangoes'  />

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

{/* fresh mango */}
      <div className="py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col gap-8 justify-center items-center ">
            <svg width="150" height="16" viewBox="0 0 150 16" fill="none" className={`flex-shrink-0 text-primary`}>
              <path d="M0,8 Q6,0 12,8 Q18,16 24,8 Q30,0 36,8 Q42,16 48,8 Q54,0 60,8 Q66,16 72,8 Q78,0 84,8 Q90,16 96,8 Q102,0 108,8 Q114,16 120,8 Q126,0 132,8 Q138,16 144,8 Q150,0 156,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h6 className="font-medium text-banner uppercase tablet:text-sm text-xs">
              Welcome to Mango Bite - Top Mango Exporter
            </h6>
            <h2 className="font-bold lg:text-5xl tablet:text-4xl text-3xl text-secondary ">
              Buy Fresh Mangoes
            </h2>
            <p className="text-sm max-w-md font-normal leading-loose text-center text-gray-800">
              Your ultimate destination for premium New Zealand mangoes available online! Explore our diverse range of fresh mangoes, including popular varieties like Banganapalli (Benishan), Alphonso (King of Mangoes), Kesar, Dasheri, Langra, Chaunsa, Rajapuri, Totapuri, and more. With convenient mango delivery straight to your doorstep, you can enjoy the delicious taste and health benefits of mangoes from the comfort of your home. 
            </p>
                <Link href='/shop' className='px-6 py-2 rounded-sm  hover:bg-banner  font-semibold w-fit bg-primary text-white self-center'>Shop Now</Link>

          </div>
          <div className="relative w-full min-h-[420px] md:min-h-[600px]">
            <Image fill alt='mango image' src='/images/mangoimage.png' className="object-contain animate-float" />
          </div>
        </div>
      </div>

      

      <div className="py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-7xl mx-auto place-items-center">

          <div className="relative w-full min-h-[400px] md:min-h-[500px]">
            <Image fill alt='mango image' src='/images/image-mang.png' className="object-contain animate-float" />
            
          </div>

          <div className="flex flex-col gap-4 w-full">
            <h3 className="text-secondary font-bold tablet:text-4xl text-2xl md:text-start text-center">
              Gift Your Employees
            </h3>
            <h4 className="text-banner font-semibold tablet:text-3xl text-2xl md:text-start text-center">
              100% Naturally Ripen
            </h4>
            <h2 className="text-primary font-semibold tablet:text-3xl text-2xl md:text-start text-center">
              Indian farm <br/>
              grown Mango
            </h2>

            <p className="text-base font-normal text-banner md:text-start text-center">
              Buy fresh and healthy organic mangoes.
            </p>

             <div className="mt-4">
              <MangoCarousel />
             </div>
          </div>
          
        </div>
      </div>

      <div className="py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <Testimonials/>
        </div>
      </div>

      <div className="py-12">
          <div className="relative flex py-25 px-8 justify-center items-center [overflow-x:clip]" style={{ backgroundImage: `url(/images/leaf.jpg)` , backgroundSize: 'cover', backgroundPosition: 'center' }}>
          
                      <div className="absolute inset-0 bg-black opacity-70" />
          
                      <div className="absolute bottom-0 left-0 w-48 lg:w-72 pointer-events-none select-none z-0 translate-x-[-25%] translate-y-[25%]">
                          <Image src="/images/bottom_leaf_left.png" alt="" width={300} height={300} className="w-full h-auto" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-48 lg:w-72 pointer-events-none select-none z-0 translate-x-[25%] translate-y-[25%]">
                          <Image src="/images/bottom_leaf_right.png" alt="" width={300} height={300} className="w-full h-auto" />
                      </div>
                      <div className="absolute top-0 right-0 w-48 lg:w-72 pointer-events-none select-none z-0 translate-x-[25%] translate-y-[-25%]">
                          <Image src="/images/leaf_right.png" alt="" width={300} height={300} className="w-full h-auto" />
                      </div>
          
                              <div className="relative z-10 flex flex-col gap-6 text-white justify-center items-center text-center max-w-7xl mx-auto">
                                  <h6 className="text-center text-white text-xs font-semibold uppercase">
                                      mango bite
                                  </h6>
                                  <h2 className="text-center text-3xl tablet:text-5xl max-w-2xl leading-tight font-bold text-pretty capitalize">
                                      Look no further! Here's your guide to locating the best mangoes near you
                                  </h2>
                                  <p className="text-sm max-w-2xl leading-loose">
                                      One of the finest mangoes you'll ever taste is the Alphonso — golden, buttery, and intensely aromatic, with a richness that makes it the undisputed king of mangoes.                                </p>
                                  <Link href="/shop" className="bg-primary py-3 px-5 font-bold hover:bg-secondary uppercase text-white text-xs rounded-md">
                                      shop now
                                  </Link>
                              </div>
                      
          
                   </div>

      </div>


        <Cards/>

    </div>
  )
}
