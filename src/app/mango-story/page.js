import PageBanner from '@/components/common/PageBanner'
import React from 'react'
import Image from 'next/image'
import SectionHeading from '@/components/common/SectionHeading'
import ImageParaSection from '@/components/common/ImageParaSection'
import ImageCard from '@/components/common/ImageCard'
import GalleryCarousel from '@/components/common/GalleryCarousel'
import Link from 'next/link'
import { getGalleryImages } from '@/lib/shopify'

export default async function page() {
  const galleryImages = await getGalleryImages()

    const items =[
        {
            image:'/images/organic.png',
            title:'100% Organic Mangoes'
        },
        {
            image:'/images/pulpy.png',
            title:'Delicious & Pulpy'
        },
        {
            image:'/images/delivery.png',
            title:'all over nz delivery'
        },
        {
            image:'/images/varieties.png',
            title:'varieties of mangoes'
        },
        {
            image:'/images/farmers.png',
            title:'Directly from Farmers'
        },
        {
            image:'/images/chemicalfree.png',
            title:'carbide & chemical free'
        },
    ]
  return (
    <div className='flex flex-col gap-12'>
        
        <div className="flex flex-col">
            <PageBanner description="Grab Your Snack Time Essential  - Mango Bite !" 
            minorTitle='mango bite' 
            title='My mango story'
           
                breadCrumbs={[
                    
                    { label: 'Mango Story' }
                ]}
                
            />

         {/* <div className="bg-black">
            <div className="max-w-7xl mx-auto py-10 px-4 flex justify-center items-center">
                <Image src="/images/image-mang.png" alt="Mango Story" width={500} height={500} className='w-64 md:w-80 lg:w-[500px] object-contain drop-shadow-2xl animate-float'/>
            </div>
         </div> */}

        </div>

         <div className="bg-white flex flex-col gap-12 pb-10 px-8">
            <div className="flex flex-col gap-12 max-w-7xl mx-auto">
                <SectionHeading mainHeading="my mango story" />
                <ImageParaSection image='/images/mangoboy.jpg'
                firstPara='Let me introduce myself; my name is Nirmal, and when I was a kid, mangoes were not just a fruit but a gateway to a world of stories and cherished memories. The sweet and luscious taste of mangoes always reminds me of carefree days, filled with laughter and adventure.'
                secondPara='Driven by nostalgia and a desire to share love and taste with the rest of the world, I set out on a journey to create Mangobite. In 2016, the idea was just a fantasy, but its ultimate goal was to become a hub for fresh produce and services from all over the world. I’ll never forget that first Sunday, when my family and I set up a cute mango stall at the Avondale Farmers Market. Although we did not have high hopes, the overwhelming demand from customers ultimately reinforced our faith. Thus, Mangobite was born.' 
                
                />
                <ImageParaSection
                reverse
                 image='/images/mangoshop.webp'
                firstPara='Our commitment to quality at Mangobite has helped us quickly build a strong reputation in local market of New Zealand. We knew that the key to our success was providing first-rate service and goods to our customer.  Specializing in food and agricultural products, we carefully selected a wide range of offerings to satisfy the diverse tastes and preferences of our customers.'
                secondPara='Mangobite as a brand always made a conscious decision to promote organic farming practices. By supporting organic farms, we ensured mangoes were grown without the use of harmful chemicals or pesticides. This not only preserved the purity and quality of the fruit but also contributed to the health and well-being of our customers.

                        The truth is that without my wonderful wife Bharani’s support and encouragement, I never would have put in the time or effort necessary to establish our business. We’re pleased that Mangobite has become a venue for fostering nostalgia for childhood tastes while also advocating for environmentally responsible solutions to a more wholesome global community.

                        And so, the Mangobite narrative rolls on, with my family and I at the forefront of the effort to introduce the world to the joy, nostalgia, and great flavour of mangoes.' 
                
                />

                <div className="mt-10">
                     <ImageCard items={items} />
                </div>

            </div>

        
         </div>

                {/* mangostory bottom banner */}
         <div className="relative flex py-25 px-8 justify-center items-center [overflow-x:clip]" style={{ backgroundImage: `url(/images/mango_banner1.jpeg)` , backgroundSize: 'cover', backgroundPosition: 'center' }}>

            <div className="absolute inset-0 bg-black opacity-80" />

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
                            mangobite
                        </h6>
                        <h2 className="text-center text-3xl tablet:text-5xl max-w-xl leading-tight font-bold text-pretty capitalize">
                            Savor the Juicy Goodness of Mango Bite !
                        </h2>
                        <p className="text-sm max-w-xl">
                            One of the finest mangoes of South India is the hugely popular banganapalli mango grown extensively in Andhra Pradesh and Telangana.
                        </p>
                        <Link href="/shop" className="bg-primary py-3 px-5 font-bold hover:bg-secondary uppercase text-white text-xs rounded-md">
                            shop now
                        </Link>
                    </div>
            

         </div>

{/* gallery */}
         <div className="px-8 py-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                <SectionHeading minorHeading='FOLLOW ALONG' mainHeading='@Mango Bite' />
                <GalleryCarousel images={galleryImages} />
            </div>
         </div>
    </div>
  )
}
