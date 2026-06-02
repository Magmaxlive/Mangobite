import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF,FaInstagram,FaPhoneAlt  } from "react-icons/fa";


export default function Footer() {
    const links = [
        { title: 'Home', href: '/' },
        { title: 'Mango Story', href: '/mango-story' },
        { title: 'Mango Journey', href: '/mango-journey' },
        { title: 'Contact us', href: '/contact' },
        { title: 'refund policy', href: '/refund-policy' },
        { title: 'blogs', href: '/blogs' },
    ];
  return (
    <div className='px-8 pt-10 pb-20 mt-8' style={{ backgroundImage: `url(/images/footer_w.png)` , backgroundSize: 'cover', backgroundPosition: 'top' }}>
        <div className="flex justify-evenly items-start flex-wrap max-w-5xl mx-auto gap-10">

            <div className="flex items-center">
                <Image src="/images/mango_logo.png"
                    alt="Mangobite"
                    width={100}
                    height={100}
                    className='h-20 w-auto'/>
            </div>

            <div className="flex flex-col gap-3 text-center uppercase text-sm font-semibold tablet:border-x-2 tablet:border-primary px-18">
                {links.map((link, index) => (
                    <Link key={index} href={link.href} className='hover:text-secondary text-black cursor-pointer'>{link.title}</Link>
                ))}
            </div>

            <div className="flex flex-col gap-5 text-center items-center text-sm font-semibold">
                <div className="flex gap-4">
                    <Link href="https://www.facebook.com/mangobitenz" className='hover:text-secondary' target="_blank" rel="noopener noreferrer">
                        <FaFacebookF size={25} />
                    </Link>
                    <Link href="https://www.instagram.com/mangobitenz" className='hover:text-secondary' target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={25} />
                    </Link>
                </div>

                <Link className="hover:text-secondary flex items-center gap-2" href="tel:0277224561">
                    <FaPhoneAlt size={18} />
                    <span className="text-xl">02772-24561</span>
                </Link>

                <p className="text-sm text-black font-normal">© {new Date().getFullYear()} Mangobite<br/>All Rights Reserved.</p>
            </div>

        </div>
      
    </div>
  )
}
