import PageBanner from '@/components/common/PageBanner'
import React from 'react'

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
