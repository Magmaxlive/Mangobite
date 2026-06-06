import React from 'react'
import SectionHeading from './SectionHeading'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: "Sandeep",
    image: "/images/t1.png",
    review:
      "These mangoes were perfect for making homemade pickles and jam! Their freshness and vibrant flavour turned my kitchen into a fragrant culinary paradise. They always have a place in my heart.",
  },
  {
    id: 2,
    name: "Srinivas from Napier",
    image: "/images/t2.png",
    review:
      "I have been in NZ for 20 years and never have I had a mango that's so delicious. They are simply amazing & sweet. Thanks for bringing them here.",
  },
  {
    id: 3,
    name: "Tony & Astha",
    image: "/images/t3.png",
    review:
      "These mangoes took me straight back to my childhood days! The packaging preserved their nostalgic sweetness, evoking memories of carefree summers spent enjoying nature's candy. Thank you for bringing back those cherished moments!",
  },
];

export default function Testimonials() {
  return (
    <div className='flex flex-col gap-12'>
        <SectionHeading mainHeading='testimonials' minorHeading='what our clients say' />
        <div className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 gap-8">
            {testimonials.map((i,index)=>(
                <div key={index} className="flex flex-col gap-4 p-6 border-2 border-white hover:border-2 hover:border-primary rounded-md bg-gray-200 justify-between">
                    <p className="text-sm text-banner">
                        {i.review}
                    </p>
                    <div className="flex gap-4 items-center">
                        <Image height={50} width={50} alt={`${i.name} image`} src={i.image} className='rounded-full' />
                        <p className="text-sm font-semibold">
                            {i.name}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
