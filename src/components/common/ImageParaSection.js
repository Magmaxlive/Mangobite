import React from 'react'
import Image from 'next/image';

export default function ImageParaSection({image,firstPara,secondPara,reverse,alt}) {
  return (
    <div className='flex flex-col justify-center items-center gap-8'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <Image src={image} alt={alt || "mango story Image"} width={500} height={500} className={`w-full h-full rounded-lg ${reverse ? 'md:order-2' : 'md:order-1'}`}/>
            <p className={`text-gray-700 text-base leading-relaxed max-w-lg ${reverse ? 'md:order-1' : 'md:order-2'}`}>
                {firstPara}
            </p>
        </div>

        <p className='text-gray-700 text-base leading-relaxed '>
            {secondPara}
        </p>
      
    </div>
  )
}
