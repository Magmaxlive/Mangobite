'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function OfferDeals({ banners }) {
  const { cartOpen } = useCart()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!banners?.length) return
    const seen = sessionStorage.getItem('offer_banner_seen')
    if (!seen) setOpen(true)
  }, [banners])

  useEffect(() => {
    if (!open || banners.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [open, banners.length])

  const close = () => {
    setOpen(false)
    sessionStorage.setItem('offer_banner_seen', '1')
  }

  const openPopup = () => {
    setIndex(0)
    setOpen(true)
  }

  const go = (dir) => {
    clearInterval(timerRef.current)
    setIndex(i => (i + dir + banners.length) % banners.length)
  }

  if (!banners?.length) return null

  const banner = banners[index]

  return (
    <>
      {/* Floating Deals button */}
      {!cartOpen && (
        <button
          onClick={openPopup}
          className="flame-glow"
          style={{
            position: 'fixed',
            bottom: '148px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: 'none',
            padding: 0,
            background: 'transparent',
          }}
        >
          <div style={{ position: 'relative', width: '55px', height: '60px' }}>
            <Image src="/images/fire.png" alt="Deals" fill className="object-contain" />
          </div>
          <span style={{
            color: '#fff',
            fontSize: '10px',
            fontWeight: '900',
            letterSpacing: '1.5px',
            textShadow: '0 0 6px rgba(255,80,0,1), 0 1px 3px rgba(0,0,0,0.9)',
            lineHeight: 1,
            marginTop: '0px',
          }}>
            DEALS
          </span>
        </button>
      )}

      {/* Popup */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 rounded-full p-1.5 transition cursor-pointer"
            >
              <X size={16} className="text-white" />
            </button>

            {/* Image */}
            {banner.image && (
              <div className="relative w-full">
                <Image
                  src={banner.image.url}
                  alt={banner.image.altText || banner.title || 'Offer'}
                  width={banner.image.width || 800}
                  height={banner.image.height || 800}
                  className="w-full object-contain"
                  style={{ height: 'auto', maxHeight: '55vh' }}
                  priority
                />

                {/* Prev / Next arrows */}
                {banners.length > 1 && (
                  <>
                    <button
                      onClick={() => go(-1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 rounded-full p-2 transition cursor-pointer"
                    >
                      <ChevronLeft size={20} className="text-white" />
                    </button>
                    <button
                      onClick={() => go(1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 rounded-full p-2 transition cursor-pointer"
                    >
                      <ChevronRight size={20} className="text-white" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Content below image */}
            <div className="flex flex-col items-center gap-4 px-8 py-6 text-center bg-white">
              {banner.title && (
                <h2 className="text-2xl font-bold text-banner">{banner.title}</h2>
              )}
              {banner.productHandle && (
                <Link
                  href={`/shop/${banner.productHandle}`}
                  onClick={close}
                  className="bg-primary hover:bg-secondary text-white font-bold px-10 py-3 rounded-full uppercase text-sm tracking-widest transition shadow-md"
                >
                  Shop Now
                </Link>
              )}

              {/* Dots */}
              {banners.length > 1 && (
                <div className="flex gap-1.5">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { clearInterval(timerRef.current); setIndex(i) }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${i === index ? 'bg-primary w-5' : 'bg-gray-300 w-1.5'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
