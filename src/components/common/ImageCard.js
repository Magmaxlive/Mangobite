import React from 'react'
import Image from 'next/image';

export default function ImageCard({items}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 gap-10'>
        {items.map((i,index)=>(

            <div key={index} className="flex flex-col justify-center items-center gap-8">
                <div className="border-2 border-primary p-6 rounded-full">
                    <Image src={i.image} alt="Image" width={90} height={90} className={`w-20 h-20 object-contain`}/>
                </div>
                <h3 className="font-bold text-base capitalize">{i.title}</h3>
            </div>

        ))}
        
    </div>
  )
}
