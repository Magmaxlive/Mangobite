import PageBanner from '@/components/common/PageBanner'
import React from 'react'

export default function page() {

    const refundPolicy = [
    "Orders can be canceled through your user account on the website on the same day before dispatch.",
    "No returns or refunds are available once the mango is ready for delivery.",
    "Delivery is expected overnight or within 2–3 days, with delivery times varying for South Island or rural deliveries across NZ, subject to the delivery partner NZ POST. Mangobite will get in touch with the logistics partner NZ POST and let you know if there is a delay or failure in this delivery.",
    "Give us a call at <a href=\"tel:+640279224561\">0279224561</a> or send us an email at <a href=\"mailto:info@mangobite.co.nz\">info@mangobite.co.nz</a> if the mangoes were damaged, pressed, squeezed, or crushed, or if there was a delay in delivery. Please provide necessary evidence (such as an image or video) so we can take appropriate action.",
    "After mutual agreement regarding the refund, Mangobite shall reverse the payment using the same method as the customer’s original payment. This refund will be processed within seven working days from the date of mutual agreement.",
    "If you haven’t received a refund, kindly check your bank account again for any pending refunds.",
    "After that, get in touch with the company that issued your credit card; it might take some time before your refund is actually posted.",
    "Contact your bank next. Before a refund is posted, there is frequently some time for processing.",
    "Please get in touch with us at <a href=\"mailto:info@mangobite.co.nz\">info@mangobite.co.nz</a> if you have completed all of this but have not yet received your refund."
    ];

    const replacementPolicy = [
        "We strictly enforce a policy of no Replacement, Exchange, or Return as Alphonso mangoes are perishable products. However, we are committed to providing you with the best fruits and ensuring a complete return on your investment. It’s important to understand that mangoes are natural fruits subject to the unpredictable forces of nature. Weather conditions, especially in regions like Ratnagiri and Devgad where Alphonso mangoes are grown, can affect the fruit’s quality.",
        "We (<a href=\"https://www.mangobite.co.nz\">www.mangobite.co.nz</a>) and our transporter are not responsible for any delays or non-delivery of the mangoes in the event of an accident, natural calamity, or other circumstances beyond our reasonable control.",
        "If you have any concerns about a product or experience any issues, please reach out to our customer support team for assistance on <a href=\"tel:+640277224561\">0277224561</a>. We appreciate your understanding and thank you for choosing Mangobite."
        ];

  return (
    <div>
        <PageBanner
            title='refund policy'
            minorTitle='mango bite'
            breadCrumbs={[
                {
                    label : 'Refund policy'
                }
            ]}
        />

        <div className="py-12 px-8">
            <div className="max-w-7xl mx-auto">
                <section className='flex flex-col gap-6'>
                    <h2 className='font-bold'>Refund Policy</h2>

                    <ul className='list-disc flex flex-col gap-2' style={{ paddingLeft: "1.5rem" }}>
                        {refundPolicy.map((i,index)=>
                        (
                            <li key={index} dangerouslySetInnerHTML={{__html : i}}/>
                        ))}
                    </ul>
                </section>

                <section className='flex flex-col gap-6 mt-8'>
                <h2 className='font-bold'>Replacement, Exchange &amp; Return Policy</h2>
                <ul className='list-disc flex flex-col gap-2' style={{ paddingLeft: "1.5rem" }}>
                    {replacementPolicy.map((i,index)=>
                        (
                            <li key={index} dangerouslySetInnerHTML={{__html : i}}/>
                        ))}
                </ul>
                </section>

                <section className='flex flex-col gap-6 mt-8'>
                <h2 className='font-bold'>Contact Us</h2>
                <p>Connect with us at <a href="mailto:info@mangobite.co.nz" className='text-primary underline underline-offset-4'>info@mangobite.co.nz</a> or <a href="tel:+640279224561" className='text-primary underline underline-offset-4'>0279224561</a> for questions related to refunds, returns, or exchanges.</p>
                </section>
            </div>
        </div>
      
    </div>
  )
}
