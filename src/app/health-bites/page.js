import PageBanner from '@/components/common/PageBanner'
import SectionHeading from '@/components/common/SectionHeading'
import HealthBenefitsArc from '@/components/common/HealthBenefitsArc'
import React from 'react'


export const metadata = {
  title: 'Mango Health Insights, Boost Your Well-being with Every Bite',
  description: "Explore the numerous health benefits of mangoes, including their rich vitamin content and antioxidant properties, on Mango Bite's Health Bites page",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
};


export default function page() {
  return (
    <div className='flex flex-col [overflow-x:clip]'>
        <PageBanner
            minorTitle="mango bite"
            title="health bites"
            description='Go tropical. Fuel your day with the sweet power of mango.'
            breadCrumbs={[
                { label: 'Health Bites'}
            ]}
        />

        <div className="flex flex-col gap-8 pt-12  pb-20 px-8 max-w-7xl mx-auto">
            <SectionHeading
                minorHeading="why mangoes"
                mainHeading="health benefits"
            />
            <HealthBenefitsArc />
        </div>
    </div>
  )
}
