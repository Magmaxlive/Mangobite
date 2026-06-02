'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function GalleryCarousel({ images }) {
  const [start, setStart] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const [visible, setVisible] = useState(4)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setVisible(1)
      else if (window.innerWidth < 1200) setVisible(2)
      else setVisible(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (!images || images.length === 0) return null

  return (
    <>
      {/* Carousel */}
      <div className="relative px-8">

        <button
          type="button"
          onClick={() => setStart(s => Math.max(0, s - 1))}
          disabled={start === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full p-2 disabled:opacity-25 hover:bg-gray-50 cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${start * (100 / visible)}%)` }}
          >
            {images.map((img, i) => (
              <div
                key={img.id}
                className="flex-shrink-0 px-2 cursor-pointer"
                style={{ width: `${100 / visible}%` }}
                onClick={() => setLightbox(i)}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={img.url}
                    alt={img.altText || ''}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStart(s => Math.min(images.length - visible, s + 1))}
          disabled={start >= images.length - visible}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full p-2 disabled:opacity-25 hover:bg-gray-50 cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            type="button"
            style={{ position: 'absolute', top: 16, right: 16, color: 'white', cursor: 'pointer', background: 'none', border: 'none' }}
            onClick={(e) => { e.stopPropagation(); setLightbox(null) }}
          >
            <X size={36} />
          </button>

          {/* Prev */}
          <button
            type="button"
            style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer', background: 'none', border: 'none' }}
            onClick={(e) => { e.stopPropagation(); setLightbox(l => (l - 1 + images.length) % images.length) }}
          >
            <ChevronLeft size={52} />
          </button>

          {/* Image */}
          <div
            style={{ position: 'relative', width: '85vw', height: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox].url}
              alt={images[lightbox].altText || ''}
              fill
              className="object-contain"
              sizes="85vw"
            />
          </div>

          {/* Next */}
          <button
            type="button"
            style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer', background: 'none', border: 'none' }}
            onClick={(e) => { e.stopPropagation(); setLightbox(l => (l + 1) % images.length) }}
          >
            <ChevronRight size={52} />
          </button>

          {/* Counter */}
          <span style={{ position: 'absolute', bottom: 16, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            {lightbox + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  )
}
