'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function OfferBannerPopup({ banners }) {
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!banners?.length) return
    const seen = sessionStorage.getItem('offer_banner_seen')
    if (!seen) setVisible(true)
  }, [banners])

  useEffect(() => {
    if (!visible || banners.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [visible, banners.length])

  const close = () => {
    setVisible(false)
    sessionStorage.setItem('offer_banner_seen', '1')
  }

  const go = (dir) => {
    clearInterval(timerRef.current)
    setIndex(i => (i + dir + banners.length) % banners.length)
  }

  if (!visible || !banners?.length) return null

  const offer_banner = banners[index]

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative bg-white w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow transition cursor-pointer"
        >
          <X size={18} className="text-gray-700" />
        </button>

        {/* Image */}
        {offer_banner.image && (
          <div className="relative w-full h-[55vh]">
            <Image
              src={offer_banner.image.url}
              alt={offer_banner.image.altText || offer_banner.title || 'Offer'}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* Content */}
        {(offer_banner.title || offer_banner.productHandle) && (
          <div className="flex flex-col items-center gap-3 px-6 py-5 text-center">
            {offer_banner.title && (
              <h2 className="text-xl font-bold text-banner">{offer_banner.title}</h2>
            )}
            {offer_banner.productHandle && (
              <Link
                href={`/shop/${offer_banner.productHandle}`}
                onClick={close}
                className="mt-1 bg-primary hover:bg-banner text-white font-semibold px-6 py-2.5 rounded-sm uppercase text-sm transition"
              >
                Shop Now
              </Link>
            )}
          </div>
        )}

        {/* Slider controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition cursor-pointer"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition cursor-pointer"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>

            <div className="flex justify-center gap-1.5 pb-4">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { clearInterval(timerRef.current); setIndex(i) }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === index ? 'bg-primary w-5' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
