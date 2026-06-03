'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

const TABS = [
  { key: 'alsoKnownAs',     label: 'Also known as',         image: '/images/info1.png'   },
  { key: 'origin',          label: 'Origin',                image: '/images/info2.png'   },
  { key: 'season',          label: 'Season',                image: '/images/info3.png'   },
  { key: 'shape',           label: 'Shape',                 image: '/images/info4.png'   },
  { key: 'tasteTexture',    label: 'Taste & Texture',       image: '/images/info5.png'   },
  { key: 'characteristics', label: 'Other Characteristics', image: '/images/info6.png'   },
  { key: 'weight',          label: 'Weight',                image: '/images/info7.png'   },
]

export default function MangoInfo({ title, details }) {
  const [active, setActive] = useState(TABS[0].key)
  const [scrollPct, setScrollPct] = useState(0)
  const scrollRef = useRef(null)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const pct = el.scrollLeft / (el.scrollWidth - el.clientWidth)
    setScrollPct(pct)
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1068px] mx-auto">
      <h2 className="text-2xl font-bold text-banner text-center">{title}</h2>

      {/* Tabs */}
      <div className="flex flex-col gap-2">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto px-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map(({ key, label, image }) => {
            const isActive = active === key
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`flex flex-col flex-shrink-0 items-center gap-3 px-4 pt-4 pb-3 rounded-2xl w-[140px] transition-colors duration-200 cursor-pointer ${
                  isActive ? 'bg-secondary' : 'bg-mangoYellow'
                }`}
              >
                <div className="w-20 h-20 rounded-full bg-mangoBg flex items-center justify-center overflow-hidden p-3">
                  <Image src={image} alt={label} width={64} height={64} className="object-contain" />
                </div>
                <span className={`text-xs font-bold text-center leading-snug w-full ${isActive ? 'text-white' : 'text-black'}`}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Scroll indicator — only visible on smaller screens */}
        <div className="lg:hidden h-0.5 rounded-full bg-gray-200 w-16 mx-auto">
          <div
            className="h-full rounded-full bg-primary transition-all duration-150"
            style={{ width: '40%', transform: `translateX(${scrollPct * 150}%)` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#f5f0e8] rounded-2xl px-6 py-5 min-h-14 w-full">
        <div className="text-gray-700 text-sm leading-relaxed">
          {details?.[active] ?? '—'}
        </div>
      </div>
    </div>
  )
}
