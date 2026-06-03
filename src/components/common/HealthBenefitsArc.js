'use client'
import { useState } from 'react'
import Image from 'next/image'

const benefits = [
  { id: 0, title: 'Rich in Nutrients', description: 'Mangoes are a rich source of essential nutrients, including vitamin C, vitamin A, vitamin E, vitamin K, vitamin B6, potassium, copper, and magnesium. These nutrients play vital roles in various bodily functions and contribute to overall health.' },
  { id: 1, title: 'Boosts Immune System', description: 'The high vitamin C content in mangoes helps strengthen the immune system, making the body more resilient against infections and illnesses.' },
  { id: 2, title: 'Supports Digestive Health', description: 'Mangoes contain dietary fibre, which aids digestion and helps prevent constipation. The enzymes present in mangoes, such as amylases, facilitate the breakdown of carbohydrates and promote better digestion.' },
  { id: 3, title: 'Maintains Eye Health', description: 'Mangoes are rich in vitamin A, which is essential for maintaining good vision and eye health. It helps prevent dry eyes and night blindness.' },
  { id: 4, title: 'Regulates Blood Pressure', description: 'The potassium content in mangoes helps regulate blood pressure levels, reducing the risk of hypertension and related cardiovascular issues.' },
  { id: 5, title: 'Enhances Heart Health', description: 'Mangoes contain antioxidants, fiber, and potassium, which collectively contribute to heart health by reducing cholesterol levels, supporting healthy blood flow, and lowering the risk of heart disease.' },
  { id: 6, title: 'Aids Weight Management', description: 'Despite being naturally sweet, mangoes can be part of a healthy weight management plan when consumed in moderation due to their fiber content, which promotes satiety.' },
  { id: 7, title: 'Fights Inflammation', description: "Mangoes' anti-inflammatory properties can help reduce inflammation in the body, potentially providing relief for conditions like arthritis." },
]

const CX = 450, CY = 440, R = 330, N = 8

function getPos(i) {
  const rad = ((210 - (240 / (N - 1)) * i) * Math.PI) / 180
  return { x: CX + R * Math.cos(rad), y: CY - R * Math.sin(rad) }
}

const positions = Array.from({ length: N }, (_, i) => getPos(i))

export default function HealthBenefitsArc() {
  const [active, setActive] = useState(0)
  const p0 = positions[0]
  const pN = positions[N - 1]

  return (
    <>
      {/* Mobile / tablet: card grid */}
      <div className="grid grid-cols-1 gap-4 tablet:hidden">
        {benefits.map((b) => (
          <div key={b.id} className="flex flex-col gap-2 border border-gray-200 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-secondary">{b.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{b.description}</p>
          </div>
        ))}
      </div>

      {/* Desktop: arc layout */}
      <div className="hidden tablet:block w-full [overflow-x:clip]">
        <div className="relative mx-auto" style={{ width: 900, height: 650 }}>

          {/* Arc line */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={900}
            height={650}
            viewBox="0 0 900 650"
          >
            <path
              d={`M ${p0.x.toFixed(1)},${p0.y.toFixed(1)} A ${R},${R} 0 1 1 ${pN.x.toFixed(1)},${pN.y.toFixed(1)}`}
              fill="none"
              stroke="#FF9308"
              strokeWidth="1.5"
            />
          </svg>

          {/* Description text */}
          <div
            className="absolute flex justify-center"
            style={{ left: 300, top: 250, width: 300 }}
          >
            <p className="text-banner italic text-sm leading-relaxed font-medium text-center">
              {benefits[active].description}
            </p>
          </div>

          {/* Mango image */}
          <div className="absolute" style={{ left: 305, top: 450 }}>
            <Image
              src="/images/mangopulp.png"
              alt="Mango"
              width={290}
              height={220}
              className="object-contain"
            />
          </div>

          {/* Nodes */}
          {positions.map((pos, i) => {
            const isActive = active === i
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{ left: pos.x - 52, top: pos.y - 52, width: 104, height: 104 }}
                className={`absolute flex items-center justify-center rounded-full border-2 text-xs font-semibold text-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-secondary text-white border-secondary shadow-lg'
                    : 'bg-white text-gray-600 border-gray-300 shadow-sm hover:border-primary hover:text-primary'
                }`}
              >
                <span className="leading-tight px-4 py-2">{benefits[i].title}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
