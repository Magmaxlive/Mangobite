import PageBanner from '@/components/common/PageBanner'
import React from 'react'

export const metadata = {
  title: 'Mango Bite Disclaimer: Important Information for Our Customers',
  description: "​Read Mango Bite's disclaimer to understand the terms and conditions governing the use of our website and services",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
};

const contents = [

  {
    "id": "fresh-produce",
    "title": "Fresh Produce Disclaimer",
    "content": "<p>Mangobite specialises in supplying fresh mangoes and related products. As mangoes are a natural agricultural product, variations in size, colour, shape, aroma, sweetness, ripeness, and shelf life are normal and should be expected. Product images are provided for illustrative purposes only and may not exactly represent the product you receive.</p>"
  },
  {
    "id": "product-information",
    "title": "Product Information",
    "content": "<p>We make every effort to ensure that product descriptions, pricing, availability, and other information on our website are accurate and up to date. However, errors, omissions, or inaccuracies may occasionally occur. Mangobite reserves the right to correct any errors and update information without prior notice.</p>"
  },
  {
    "id": "availability",
    "title": "Availability",
    "content": "<p>All products are subject to seasonal availability and stock levels. We reserve the right to limit quantities, substitute products where appropriate, or cancel orders if products become unavailable.</p>"
  },
  {
    "id": "delivery",
    "title": "Delivery",
    "content": "<p>While we aim to deliver orders within the estimated delivery timeframe, delivery schedules may be affected by factors beyond our control, including weather conditions, courier delays, public holidays, and operational disruptions.</p><p>Mangobite is not responsible for delays caused by third-party delivery providers.</p>"
  },
  {
    "id": "food-safety-allergies",
    "title": "Food Safety and Allergies",
    "content": "<p>Customers are responsible for ensuring products are suitable for their individual dietary requirements. If you have food allergies or specific health concerns, please seek professional advice before consuming any product.</p>"
  },
  {
    "id": "website-use",
    "title": "Website Use",
    "content": "<p>The information provided on this website is for general information purposes only. While we strive for accuracy, Mangobite makes no guarantees regarding the completeness, reliability, or suitability of the information for any particular purpose.</p><p>Any reliance you place on information contained on this website is strictly at your own risk.</p>"
  },
  {
    "id": "external-links",
    "title": "External Links",
    "content": "<p>Our website may contain links to third-party websites. These links are provided for convenience only. Mangobite has no control over the content or practices of external websites and accepts no responsibility for them.</p>"
  },
  {
    "id": "limitation-of-liability",
    "title": "Limitation of Liability",
    "content": "<p>To the maximum extent permitted by New Zealand law, Mangobite shall not be liable for any loss, damage, cost, or expense arising from the use of this website, the purchase of products, delivery delays, website interruptions, or reliance on information provided through the website.</p><p>Nothing in this Disclaimer is intended to exclude, restrict, or modify any rights or remedies available to consumers under applicable New Zealand consumer protection laws, including the Consumer Guarantees Act 1993 and the Fair Trading Act 1986.</p>"
  },
  {
    "id": "intellectual-property",
    "title": "Intellectual Property",
    "content": "<p>All content on this website, including text, graphics, logos, photographs, product descriptions, and branding, is the property of Mangobite unless otherwise stated and may not be copied, reproduced, or distributed without prior written permission.</p>"
  },
  {
    "id": "changes",
    "title": "Changes to This Disclaimer",
    "content": "<p>Mangobite may update this Disclaimer from time to time. Any changes will be posted on this page and will take effect immediately upon publication.</p>"
  },
  {
    "id": "contact",
    "title": "Contact Us",
    "content": "<p>If you have any questions regarding this Disclaimer, please contact us at:</p><p><strong>Mangobite</strong><br>Email: <a href=\"mailto:abc@mangobite.co.nz\" class='text-banner underline underline-offset-4'>abc@mangobite.co.nz</a><br>Phone: <a href=\"tel:0277224561\" class='text-banner underline underline-offset-4'>02772-24561</a></p>"
  }
]

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

        <div className="py-15 px-8">
          <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            <p className="text-sm text-gray-600">Last Updated: 06/11/2026</p>
            <p className='text-base text-banner'>Welcome to Mangobite. By using this website, you agree to the terms of this Disclaimer.</p>
              {contents.map((i,index)=>(
                <div className="flex flex-col gap-4" key={index}>
                  <h2 className="text-lg font-bold">{i.title}</h2>
                  <div className="text-base text-banner" dangerouslySetInnerHTML={{__html:i.content}} />
              </div>
              ))}
          </div>
        </div>
      
    </div>
  )
}
