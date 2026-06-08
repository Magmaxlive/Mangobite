import React from 'react'
import Image from 'next/image';
import SectionHeading from './SectionHeading';

export default function Cards() {
    const features = [
  {
    id: 1,
    title: "Fresh Mangoes",
    description: "100% Fresh Mangoes directly from farms of Mango Bite.",
    icon: "/images/icon-1.jpg",
  },
  {
    id: 2,
    title: "Quick Delivery",
    description: "Mangoes will be delivered within 4 days.",
    icon: "/images/icon-2.jpg",
  },
  {
    id: 3,
    title: "Guarantee",
    description: "We offer a replacement guarantee on all our products.",
    icon: "/images/icon-4.jpg",
  },
];
  return (
    <div className='flex flex-col gap-12 py-12 px-8'>
      <SectionHeading mainHeading='why mangobite' minorHeading='shop with us' />
        <div className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((i,index)=>(
                <div key={index} className="flex flex-col gap-6 justify-center items-center lg:max-w-[90%] p-8 bg-gray-200 rounded-md">
                    <Image src={i.icon} height={100} width={100} alt={i.title} className='rounded-md' />
                    <h4 className="text-center font-bold text-base">
                        {i.title}
                    </h4>
                    <p className="text-center text-sm">
                        {i.description}
                    </p>
                </div>
            ))}
        </div>
      
    </div>
  )
}
