'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductDetail({ product }) {
  const { addItem, loading } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [imgIndex, setImgIndex] = useState(0)

  const fmt = (amount, currency) =>
    new Intl.NumberFormat('en-NZ', { style: 'currency', currency: currency || 'NZD' }).format(amount)

  const images = product.images
  const available = selectedVariant?.availableForSale ?? false
  const hasMultipleVariants = product.variants.length > 1 && product.variants[0]?.title !== 'Default Title'

  return (
    <div className="py-14 px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

        {/* Image gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg">
            {images[imgIndex] ? (
              <Image
                src={images[imgIndex].url}
                alt={images[imgIndex].altText || product.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <ShoppingBag size={64} strokeWidth={1} />
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImgIndex(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition cursor-pointer ${
                    i === imgIndex ? 'border-banner' : 'border-transparent'
                  }`}
                >
                  <Image src={img.url} alt={img.altText || ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black text-banner uppercase">{product.title}</h1>
            <p className="text-2xl font-bold text-primary">
              {fmt(selectedVariant?.price?.amount ?? product.price?.amount, selectedVariant?.price?.currencyCode ?? product.price?.currencyCode)}
            </p>
          </div>

          {/* Variant selector */}
          {hasMultipleVariants && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">Size / Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={!v.availableForSale}
                    className={`px-4 py-2 text-sm font-semibold border-2 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedVariant?.id === v.id
                        ? 'border-banner bg-banner text-white'
                        : 'border-gray-200 hover:border-banner text-banner'
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => available && selectedVariant && addItem(selectedVariant.id)}
            disabled={!available || loading}
            className="flex items-center justify-center gap-2 bg-banner text-white font-semibold py-4 uppercase tracking-wide hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShoppingBag size={18} />
            {available ? 'Add to Cart' : 'Sold Out'}
          </button>

          {product.descriptionHtml && (
            <div
              className="prose prose-sm text-gray-600 max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>

      </div>
    </div>
  )
}
