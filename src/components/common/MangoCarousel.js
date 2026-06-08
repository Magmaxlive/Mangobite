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

function getCount() {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth >= 1280) return 5
  if (window.innerWidth >= 1024) return 4
  if (window.innerWidth >= 768)  return 3
  if (window.innerWidth >= 640)  return 2
  return 1
}

export default function MangoCarousel() {
  const [index, setIndex]   = useState(0)
  const [count, setCount]   = useState(3)
  const indexRef  = useRef(0)
  const countRef  = useRef(3)
  const timerRef  = useRef(null)

  // Keep count in sync with viewport
  useEffect(() => {
    const sync = () => {
      const c = getCount()
      countRef.current = c
      setCount(c)
      const max = N - c
      if (indexRef.current > max) {
        indexRef.current = max
        setIndex(max)
      }
    }
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  function go(n) {
    const clamped = Math.max(0, Math.min(n, N - countRef.current))
    indexRef.current = clamped
    setIndex(clamped)
  }

  function startAuto() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const next = indexRef.current + 1
      go(next > N - countRef.current ? 0 : next)
    }, 3000)
  }
  function stopAuto() { clearInterval(timerRef.current) }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { startAuto(); return stopAuto }, [])

  const max      = N - count
  const dotCount = max + 1
  // Both item width and translateX expressed as % of track — always in sync
  const pct      = 100 / count

  return (
    <div className="w-full" onMouseEnter={stopAuto} onMouseLeave={startAuto}>

      <div className="flex items-center gap-2">
        <button
          onClick={() => { stopAuto(); go(index - 1); startAuto() }}
          disabled={index === 0}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-banner hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-default"
          aria-label="Previous"
        ><ChevronLeft size={16} /></button>

        {/* Clipping viewport — min-w-0 prevents flex overflow */}
        <div className="overflow-hidden flex-1 min-w-0">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: '100%',
              transform: `translateX(${-index * pct}%)`,
            }}
          >
            {VARIETIES.map((variety) => (
              <div
                key={variety.name}
                style={{ width: `${pct}%`, flexShrink: 0 }}
                className="flex flex-col items-center gap-2 py-3 px-2"
              >
                <div className="relative w-full aspect-square max-w-[95px] sm:max-w-[100px] md:max-w-[105px] lg:max-w-[95px] xl:max-w-[88px] mx-auto rounded-full border-2 border-primary/60 bg-white shadow-md overflow-hidden">
                  <Image
                    src={variety.image}
                    alt={variety.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <span className="font-semibold text-banner text-xs text-center">
                  {variety.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { stopAuto(); go(index + 1); startAuto() }}
          disabled={index >= max}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-banner hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-default"
          aria-label="Next"
        ><ChevronRight size={16} /></button>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: dotCount }, (_, i) => (
          <button
            key={i}
            onClick={() => { stopAuto(); go(i); startAuto() }}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === index ? 'w-5 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

    </div>
  )
}
