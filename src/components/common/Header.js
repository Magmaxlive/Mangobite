'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from "next/image";
import {Menu,X} from 'lucide-react'
import headerMenu from '../../data/headerMenu';
import Link from 'next/link';
import { Search,UserRound,ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import SearchModal from '@/components/common/SearchModal';
import { FaFacebook,FaInstagram,FaPhoneAlt  } from "react-icons/fa";


const Navbar = () => {
    const [drawerOpen,setDrawerOpen]=useState(false)
    const [scrolled,setScrolled]=useState(false)
    const pathname=usePathname()
    const { setCartOpen, itemCount } = useCart()
    const [searchOpen, setSearchOpen] = useState(false)
    const accountUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/account`
    const pollRef = useRef(null)

    useEffect(()=>{
        const check = () => setScrolled(window.scrollY > 10)
        const start = () => {
            check()
            clearInterval(pollRef.current)
            pollRef.current = setInterval(check, 200)
        }
        start()
        // Not removed in cleanup — survives bfcache pagehide so it can
        // restart polling when the page is restored (pageshow with persisted=true).
        window.addEventListener('pageshow', start)
        return () => clearInterval(pollRef.current)
    },[])

    const toggleNavbar=()=>{
        setDrawerOpen(!drawerOpen)
    }
  return (
    <>
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        <nav className={`fixed top-0 left-0 flex flex-col w-full z-50 border-neutral-900 transition-colors duration-300 ${scrolled ? 'bg-banner' : 'bg-transparent'}`}>
            <div className={`bg-primary/70  overflow-hidden transition-all duration-300 ${scrolled ? 'max-h-0 opacity-0' : 'max-h-16 opacity-100'}`}>
                <div className="flex justify-between py-2 px-8 max-w-7xl mx-auto">

                    <Link className="text-white flex hover:underline underline-offset-4 items-center gap-2" href="tel:0277224561">
                            <FaPhoneAlt size={18} />
                            <span className="text-sm">02772-24561</span>
                    </Link>

                    <div className="flex gap-3">
                        <Link href="https://www.facebook.com/mangobitenz" className='text-white hover:underline underline-offset-4' target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={20} />
                        </Link>
                        <Link href="https://www.instagram.com/mangobitenz" className='text-white hover:underline underline-offset-4' target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={20} />
                        </Link>
                    </div>

                </div>
            </div>
            <div className="container py-4 px-8 mx-auto relative text-sm max-w-7xl">
                <div className="flex justify-between items-center">
                    <Link href='/' className="flex items-center flex-shrik-0">
                        <Image src="/images/mango_logo.png"
                            alt="Mangobite"
                            width={100}
                            height={100} className='h-18 lg:w-full'/>
                    </Link>

                    <ul className='hidden font-bold uppercase lg:flex  space-x-12'>
                        {headerMenu.map((item) => (
                            <li key={item.title}>
                                <Link href={item.link} className={`cursor-pointer hover:font-bold hover:text-secondary text-primary ${pathname === item.link ? 'text-secondary' : 'text-primary'}`}>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden lg:flex justify-center text-white font-bold gap-3 items-center">
                        <button onClick={() => setSearchOpen(true)} className="cursor-pointer"><Search /></button>
                        <a href={accountUrl} target="_blank" rel="noreferrer" className="cursor-pointer"><UserRound /></a>
                        <button onClick={() => setCartOpen(true)} className="relative cursor-pointer">
                            <ShoppingBag />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="lg:hidden md:flex flex-col justify-end">
                        <button onClick={toggleNavbar} className='cursor-pointer text-white'>
                            {drawerOpen ?<X/> : <Menu />}
                        </button>
                    </div>
                </div>

                {drawerOpen &&
                    <div className="fixed right-0 z-20 bg-banner w-full mt-2 p-8 flex flex-col justify-start items-start lg:hidden gap-3">
                        <ul className='flex flex-col gap-3'>
                        {headerMenu.map((item) => (
                            <li key={item.title}>
                                <Link href={item.link} onClick={() => setDrawerOpen(false)} className={`cursor-pointer uppercase font-bold hover:text-secondary text-primary ${pathname === item.link ? 'text-secondary' : 'text-primary'}`}>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                        </ul>

                        <div className="flex mt-5 justify-between gap-4 text-white items-start ">
                            <button onClick={() => { setSearchOpen(true); setDrawerOpen(false) }} className="cursor-pointer"><Search /></button>
                            <a href={accountUrl} target="_blank" rel="noreferrer" onClick={() => setDrawerOpen(false)} className="cursor-pointer"><UserRound /></a>
                            <button onClick={() => setCartOpen(true)} className="relative cursor-pointer">
                                <ShoppingBag />
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                }
            </div>
        </nav>
    </>
  )
}

export default Navbar