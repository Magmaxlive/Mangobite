import React from 'react'
import Image from 'next/image';

export default function ImageCard({items}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 gap-10'>
        {items.map((i,index)=>(

            <div key={index} className="flex flex-col justify-center items-center gap-8">
                <div className="bg-accent p-8 rounded-full">
                    <Image src={i.image} alt="Image" width={103} height={103} className={`w-30 h-30 object-contain`}/>
                </div>
                <h3 className="font-bold text-base capitalize">{i.title}</h3>
            </div>

        ))}
        
    </div>
  )
}
