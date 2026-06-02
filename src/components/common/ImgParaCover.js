import React from 'react'
import Image from 'next/image';

export default function ImageParaCoverSection({image,firstPara,reverse,alt}) {
  return (
    <div className='flex flex-col justify-center items-center gap-8'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className={`flex items-center justify-center ${reverse ? 'md:order-2' : 'md:order-1'}`}>
                <div
                    className="w-full max-w-sm"
                    style={{
                        WebkitMaskImage: "url('/images/treecover.png')",
                        maskImage: "url('/images/treecover.png')",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                    }}
                >
                    <div className="relative aspect-square w-full">
                        <Image src={image} alt={alt || "Mango Image"} fill className="object-cover"/>
                    </div>
                </div>
            </div>
            <p className={`text-gray-700 text-base leading-relaxed max-w-xs tablet:max-w-md ${reverse ? 'md:order-1' : 'md:order-2'}`}>
                {firstPara}
            </p>
        </div>

    </div>
  )
}
