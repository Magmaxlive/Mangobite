import React from 'react'
import Image from 'next/image'

export default function TypesOfMangoes({mangoeTypes}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 gap-8'>
        {mangoeTypes.map((i,index) => (
              <div key={index} className="flex flex-col gap-4 rounded-full bg-mangoBg p-3 aspect-square justify-center items-center">
                <Image src={i.image} alt={i.title} width={140} height={140} className='object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]'/>
                <div className="flex flex-col gap-1">
                    <h4 className="text-center text-lg font-bold text-white italic">{i.title}</h4>
                <p className="text-center text-xs font-normal text-white">{i.location}</p>
                </div>
            </div>
        ))}

    </div>
  )
}
