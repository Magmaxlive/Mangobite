import PageBanner from '@/components/common/PageBanner'
import React from 'react'
import { MapPin,Phone,Mail } from 'lucide-react';
import { FaFacebookF,FaInstagram,FaPhoneAlt  } from "react-icons/fa";
import SectionHeading from '@/components/common/SectionHeading';
import ContactForm from '@/components/common/ContactForm';


export default function page() {

    const contact = [
        {
            icon : <Phone size={20} />,
            label : '02 772 24561',
            link : 'tel:0277224561'
        },
        {
            icon : <Mail size={20}/>,
            label : 'info@mangobite.co.nz',
            link : 'mailto:info@mangobite.co.nz'
        }
    ]

     const social = [
        {
            icon : <FaFacebookF/>,
            label : 'Facebook',
            link : 'https://www.facebook.com/mangobitenz/'
        },
        {
            icon : <FaInstagram/>,
            label : 'Instagram',
            link : 'https://www.instagram.com/mangobitenz/'
        }
    ]
  return (
    <div>
        <PageBanner
            minorTitle='find us'
            title='contact'
            description='Get in touch with us'
            breadCrumbs={[
                {
                    label : 'contact'
                }
            ]}
        />

        <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto gap-8 py-15 px-8">

                <div className="flex flex-col gap-8 border-2 border-primary rounded-md shadow-2xl  p-12">
                    <h4 className="text-center font-bold capitalize text-3xl text-banner">Location</h4>
                    <div className="flex justify-start items-center gap-4">
                        <div className="bg-accent p-3 rounded-full">
                            <MapPin size={20} />
                            
                        </div>
                        <a href='https://www.google.com/maps/place/102+White+Swan+Road,+Mount+Roskill,+Auckland+1041,+New+Zealand/@-36.917822,174.72184,11z/data=!4m6!3m5!1s0x6d0d46835833cd31:0x7e5fda2fc7e9a1e2!8m2!3d-36.9178225!4d174.7218403!16s%2Fg%2F11f3rdlwdh?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D' target='_blank' className="text-sm hover:text-secondary hover:underline underline-offset-4">
                                102 White Swan Road, Mount Roskill,
                                New Zealand

                            </a>
                    </div>
                </div>

                <div className="flex flex-col gap-8 border-2 border-primary rounded-md shadow-2xl  p-12">
                    <h4 className="text-center font-bold capitalize text-3xl text-banner">Reach us</h4>
                    <div className="flex flex-col gap-4 ">

                        {contact.map((i,index)=>(

                            <div key={index} className="flex justify-start items-center gap-4">
                                <div className="bg-accent p-3 rounded-full">
                                    {i.icon}
                                    
                                </div>
                                <a href={i.link} target='_blank' className="text-sm hover:text-secondary hover:underline underline-offset-4">
                                        {i.label}
                                    </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-8 border-2 border-primary rounded-md shadow-2xl  p-12">
                    <h4 className="text-center font-bold capitalize text-3xl text-banner">Follow Us</h4>
                    <div className="flex flex-col gap-4">

                        {social.map((i,index)=>(

                            <div key={index} className="flex justify-start items-center gap-4">
                                <div className="bg-accent p-3 rounded-full">
                                    {i.icon}
                                    
                                </div>
                                <a href={i.link} target='_blank' className="text-sm hover:text-secondary hover:underline underline-offset-4">
                                        {i.label}
                                    </a>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="py-15 bg-gray-100">
                <div className="px-8 flex flex-col gap-10">
                    <SectionHeading mainHeading = 'locate us' />

                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d204150.47674269846!2d174.72184!3d-36.917822!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d46835833cd31%3A0x7e5fda2fc7e9a1e2!2s102%20White%20Swan%20Road%2C%20Mount%20Roskill%2C%20Auckland%201041%2C%20New%20Zealand!5e0!3m2!1sen!2sin!4v1780477439177!5m2!1sen!2sin'
                  width="100%"
                  height="450"
                  style={{ border: 0 , borderRadius : '5px'}}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                </div>
            </div>

            <div className="py-15 px-8">
                <div className="flex-col flex max-w-7xl mx-auto gap-10 justify-center items-center">

                    <SectionHeading
                        minorHeading='feel free to write us'
                        mainHeading='get in touch'
                        paragraph='Thank you for your interest in our services! If you have any questions, inquiries, or would like to discuss a potential collaboration, please feel free to get in touch with us. We are here to assist you and provide the information you need.
You can reach out to us using the contact details provided below, or by filling out the contact form. We aim to respond to all enquiries promptly.'
                    />

                    <div className="max-w-4xl w-full">
                        <ContactForm/>
                    </div>

                </div>
            </div>
        </div>
      
    </div>
  )
}
