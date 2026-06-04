'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const VARIETIES = [
  { name: 'Alphonso',     image: '/images/alph.png' },
  { name: 'Banganapalli', image: '/images/mango_2.png' },
  { name: 'Kesar',        image: '/images/mango_5.png' },
  { name: 'Dasheri',      image: '/images/mango_3.png' },
  { name: 'Langra',       image: '/images/mango_4.png' },
  { name: 'Chaunsa',      image: '/images/mango_6.png' },
]

const N = VARIETIES.length

export default function MangoCarousel() {
  const [start, setStart] = useState(0)
  const timerRef = useRef(null)

  function next() { setStart(s => (s + 1) % N) }
  function prev() { setStart(s => (s - 1 + N) % N) }

  function startAuto() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 3000)
  }
  function stopAuto() { clearInterval(timerRef.current) }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { startAuto(); return stopAuto }, [])

  const visible = [0, 1, 2].map(i => VARIETIES[(start + i) % N])

  return (
    <div className="relative w-full" onMouseEnter={stopAuto} onMouseLeave={startAuto}>
      <div className="flex justify-around w-full">
        {visible.map((variety, idx) => (
          <div
            key={variety.name}
            className={`flex-shrink-0 flex flex-col items-center gap-3 py-4 ${
              idx === 1 ? 'hidden md:flex' :
              idx === 2 ? 'hidden tablet:flex' :
              ''
            }`}
          >
            <div className="relative w-25 h-25 md:w-28 md:h-28 rounded-full border-2 border-primary/60 bg-white shadow-md overflow-hidden">
              <Image
                src={variety.image}
                alt={variety.name}
                fill
                className="object-contain p-3"
              />
            </div>
            <span className="font-semibold text-banner text-sm text-center">
              {variety.name}
            </span>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => { stopAuto(); prev(); startAuto() }}
        className="absolute left-0 top-[40%] -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-banner hover:bg-primary hover:text-white hover:border-primary transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => { stopAuto(); next(); startAuto() }}
        className="absolute right-0 top-[40%] -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-banner hover:bg-primary hover:text-white hover:border-primary transition-colors"
        aria-label="Next"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {VARIETIES.map((_, i) => (
          <button
            key={i}
            onClick={() => { stopAuto(); setStart(i); startAuto() }}
            aria-label={`Go to ${VARIETIES[i].name}`}
            className={`rounded-full transition-all duration-300 ${
              i === start
                ? 'w-5 h-2.5 bg-primary'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
