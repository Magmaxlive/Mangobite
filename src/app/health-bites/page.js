import PageBanner from '@/components/common/PageBanner'
import SectionHeading from '@/components/common/SectionHeading'
import HealthBenefitsArc from '@/components/common/HealthBenefitsArc'
import React from 'react'

export default function page() {
  return (
    <div className='flex flex-col [overflow-x:clip]'>
        <PageBanner
            minorTitle="mango bites"
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
