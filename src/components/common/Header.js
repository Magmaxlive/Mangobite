'use client'

import React, { useState, useEffect } from 'react'
import Image from "next/image";
import {Menu,X} from 'lucide-react'
import headerMenu from '../../data/headerMenu';
import Link from 'next/link';
import { Search,UserRound,ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';


const Navbar = () => {
    const [drawerOpen,setDrawerOpen]=useState(false)
    const [scrolled,setScrolled]=useState(false)
    const pathname=usePathname()

    useEffect(()=>{
        const onScroll=()=>setScrolled(window.scrollY>10)
        window.addEventListener('scroll',onScroll)
        return ()=>window.removeEventListener('scroll',onScroll)
    },[])

    const toggleNavbar=()=>{
        setDrawerOpen(!drawerOpen)
    }
  return (
    <>
        <nav className={`fixed top-0 left-0 w-full z-50 py-4 border-neutral-900 transition-colors duration-300 ${scrolled ? 'bg-banner' : 'bg-transparent'}`}>
            <div className="container px-4 mx-auto relative text-sm max-w-7xl">
                <div className="flex justify-between items-center">
                    <div className="flex items-center flex-shrik-0">
                        <Image src="/images/mango_logo.png"
                            alt="Mangobite"
                            width={100}
                            height={100} className='h-18 lg:w-full'/>
                    </div>

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
                        <Search className='cursor-pointer'/>
                        <UserRound className='cursor-pointer'/>
                        <ShoppingBag className='cursor-pointer'/>
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
                                <Link href={item.link} className={`cursor-pointer uppercase font-bold hover:text-secondary text-primary ${pathname === item.link ? 'text-secondary' : 'text-primary'}`}>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                        </ul>

                        <div className="flex mt-5 justify-between gap-4 text-white items-start ">
                            <Search className='cursor-pointer'/>
                            <UserRound className='cursor-pointer'/>
                            <ShoppingBag className='cursor-pointer'/>
                        </div>
                    </div>
                }
            </div>
        </nav>
    </>
  )
}

export default Navbar