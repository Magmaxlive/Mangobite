import PageBanner from '@/components/common/PageBanner'
import React from 'react'

export const metadata = {
  title: 'Mango Bite Disclaimer: Important Information for Our Customers',
  description: "​Read Mango Bite's disclaimer to understand the terms and conditions governing the use of our website and services",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
};

export default function page() {
  return (
    <div>
        <PageBanner
            title = 'disclaimer'
            minorTitle='mango bite'
            breadCrumbs={[
                {
                    label : 'disclaimer'
                }
            ]}
        />
      
    </div>
  )
}
