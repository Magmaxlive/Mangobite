import ImageParaCoverSection from '@/components/common/ImgParaCover'
import PageBanner from '@/components/common/PageBanner'
import SectionHeading from '@/components/common/SectionHeading'
import React from 'react'

export default function page() {
  return (
    <div className='flex flex-col gap-10'>
        <PageBanner
            title="our mango journey"
            minorTitle='mango bite'
            description="From Seed to Savor: Our Incredible Mango Journey"
            breadCrumbs={[
                { label: 'Mango Journey'}
            ]}
        />

        <div className="flex flex-col pb-10 px-8 gap-10 max-w-7xl mx-auto">
            <SectionHeading mainHeading="mango's to mangoes" />

            <ImageParaCoverSection image='/images/mangotree.jpeg'
                alt='Mango Tree Image'
                firstPara='We source our mangoes exclusively from the highest-quality farms in India that also adhere to organic growing standards. The selection process is centered on finding farms that use only organic techniques of farming.' />

            <ImageParaCoverSection image='/images/mangopicking.jpg'
                alt='Mango Picking Image'
                reverse
                firstPara="The second harvest is when these mangoes are picked, so you know they're fully ripe and flavourful. Hook bags are used to drain milk by turning the cut ends upside down. With careful layering and butter sheets to soak up any excess milk, each fruit is carefully packaged." />

            <ImageParaCoverSection image='/images/mangoesbelt.webp'
                alt='Mango Belt Image'
                firstPara="APEDA then inspects and grades the packaged fruits to ensure they are up to par before they are shipped abroad. Mangoes that are graded an A+ are the only ones that make it to New Zealand." />

            <ImageParaCoverSection image='/images/vapor.jpeg'
                alt='Mango Vapor Image'
                reverse
                firstPara="To ensure a safe insecticide alternative for sterilization, protection, and import, we use the Vapor Heat Treatment technique." />

            <ImageParaCoverSection image='/images/mangopack.webp'
                alt='Mango Pack Image'
                firstPara="After the mangoes have been treated and pre-cooled, they are carefully inspected by Quarantine Administrators to make sure they are of the required quality. Only the best fruits are chosen to be packed and shipped. Mangoes are transported to the airport in chilled and closed containers before being shipped to New Zealand." />

            <ImageParaCoverSection image='/images/forklift.jpeg'
                alt='Mango Forklift Image'
                reverse
                firstPara="After arriving in New Zealand, the Ministry for Primary Industries (MPI) inspects mangoes in New Zealand for safety and quality. After MPI inspection, mangoes are delivered to the Mangobite warehouses." />

            <ImageParaCoverSection image='/images/mango-store.webp'
                alt='Mom and girl buying mangoes Image'
                firstPara="Mangoes can be ordered or purchased according to your order as soon as they arrive at the cold storage facility." />

        </div>
      
    </div>
  )
}
