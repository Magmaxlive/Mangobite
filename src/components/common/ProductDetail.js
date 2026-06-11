'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus, Check } from 'lucide-react'

export default function ProductDetail({ product }) {
  const { addItem, loading, getCartQty } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [mediaIndex, setMediaIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [addError, setAddError] = useState(null)
  const [localAvailable, setLocalAvailable] = useState(null)

  const fmt = (amount, currency) =>
    new Intl.NumberFormat('en-NZ', { style: 'currency', currency: currency || 'NZD' }).format(amount)

  const allMedia = product.media ?? []
  const available = localAvailable ?? (selectedVariant?.availableForSale ?? false)
  const cartQty = getCartQty(selectedVariant?.id)
  const isPreOrder = available && selectedVariant?.quantityAvailable !== null && selectedVariant?.quantityAvailable <= 0
  const maxQty = isPreOrder ? Infinity : (selectedVariant?.quantityAvailable ?? Infinity)
  const canAdd = available && cartQty < maxQty
  const hasMultipleVariants = product.variants.length > 1 && product.variants[0]?.title !== 'Default Title'
  const currentMedia = allMedia[mediaIndex]

  const handleAddToCart = async () => {
    if (!canAdd || !selectedVariant) return
    setAddError(null)
    const err = await addItem(selectedVariant.id, qty)
    if (err) { setAddError(err); setLocalAvailable(false); return }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="pt-12 pb-8 px-8 max-w-7xl mx-auto w-full">

      {/* Back */}
      <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-banner transition mb-8">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

        {/* ── Gallery ── */}
        <div className="flex flex-col gap-4">

          {/* Main viewer */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg border border-gray-200">
            {!currentMedia ? (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <ShoppingBag size={64} strokeWidth={1} />
              </div>
            ) : currentMedia.type === 'video' ? (
              <video
                key={currentMedia.videoUrl}
                src={currentMedia.videoUrl}
                controls
                autoPlay
                muted
                loop
                playsInline
                poster={currentMedia.previewUrl}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={currentMedia.url}
                alt={currentMedia.altText || product.title}
                fill
                className="object-cover"
                priority
              />
            )}

            {allMedia.length > 1 && (
              <>
                <button
                  onClick={() => setMediaIndex(i => (i - 1 + allMedia.length) % allMedia.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setMediaIndex(i => (i + 1) % allMedia.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {allMedia.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allMedia.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMediaIndex(i)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition cursor-pointer ${
                    i === mediaIndex ? 'border-banner' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {m.type === 'video' ? (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-banner flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-white ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <Image src={m.url} alt={m.altText || ''} fill className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col gap-6">

          {/* Title & price */}
          <div className="flex flex-col gap-2 pb-6 border-b border-gray-100">
            <h1 className="text-3xl font-black text-banner capitalize leading-tight">{product.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-bold text-primary">
                {fmt(selectedVariant?.price?.amount ?? product.price?.amount, selectedVariant?.price?.currencyCode ?? product.price?.currencyCode)}
              </span>
              {selectedVariant?.compareAtPrice?.amount &&
                parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price?.amount) && (
                <span className="text-red-400 text-lg line-through">
                  {fmt(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}
                </span>
              )}
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${!available ? 'bg-gray-100 text-gray-500' : isPreOrder ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'}`}>
                {!available ? 'Sold Out' : isPreOrder ? 'Pre Order' : 'In Stock'}
              </span>
            </div>
          </div>

          {/* Variant selector */}
          {hasMultipleVariants && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {product.options?.[0]?.name || 'Variant'}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={!v.availableForSale}
                    className={`px-4 py-2 text-sm font-semibold border-2 rounded-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedVariant?.id === v.id
                        ? 'border-banner bg-banner text-white'
                        : 'border-gray-300 hover:border-banner text-banner'
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {canAdd && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center border-2 border-gray-300 hover:border-banner rounded-sm transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="text-base font-semibold w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 flex items-center justify-center border-2 border-gray-300 hover:border-banner rounded-sm transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!canAdd || loading}
            className={`flex items-center justify-center gap-2 font-semibold py-4 uppercase tracking-wide transition cursor-pointer disabled:cursor-not-allowed rounded-sm ${
              added
                ? 'bg-secondary text-white'
                : canAdd && isPreOrder
                ? 'bg-primary text-white hover:bg-orange-500'
                : canAdd
                ? 'bg-banner text-white hover:bg-primary'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
            {added ? 'Added!' : !canAdd ? 'Sold Out' : isPreOrder ? 'Pre Order Now' : 'Add to Cart'}
          </button>

          {addError && (
            <p className="text-red-500 text-sm text-center -mt-2">{addError}</p>
          )}

          {/* Description */}
          {product.descriptionHtml && (
            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Description</p>
              <div
                className="prose prose-sm text-gray-600 max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
