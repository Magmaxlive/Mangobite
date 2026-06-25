'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingBag } from 'lucide-react'

export default function ProductCard({ product }) {
  const { addItem, loading, getCartQty } = useCart()
  const [addError, setAddError] = useState(null)
  const [localAvailable, setLocalAvailable] = useState(null)
  const firstMedia = product.media?.[0]
  const firstVariant = product.variants[0]
  const available = localAvailable ?? (firstVariant?.availableForSale ?? false)
  const cartQty = getCartQty(firstVariant?.id)
  const isPreOrder = (product.preOrder && available) || (available && firstVariant?.currentlyNotInStock === true)
  const maxQty = isPreOrder ? Infinity : (firstVariant?.quantityAvailable ?? Infinity)
  const canAdd = available && cartQty < maxQty

  const fmt = (amount, currency) =>
    new Intl.NumberFormat('en-NZ', { style: 'currency', currency: currency || 'NZD' }).format(amount)

  return (
    <div className="flex flex-col h-full border border-gray-100 rounded-2xl shadow-[0_1.2rem_3rem_rgba(0,0,0,0.22)] overflow-hidden hover:border-primary hover:border-2 hover:shadow-md transition-all duration-300 group">

      {/* Media */}
      <Link href={`/shop/${product.handle}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        {firstMedia?.type === 'video' ? (
          <video
            src={firstMedia.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            poster={firstMedia.previewUrl}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : firstMedia?.type === 'image' ? (
          <Image
            src={firstMedia.url}
            alt={firstMedia.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
        )}

        {/* <div className="absolute top-3 left-3">
          {!available ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-gray-400 px-2 py-1 rounded-sm">Sold Out</span>
          ) : isPreOrder ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-primary px-2 py-1 rounded-sm">Pre Order</span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-secondary px-2 py-1 rounded-sm">In Stock</span>
          )}
        </div> */}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-3 p-4 border-t border-gray-100">
        <div className="flex flex-col gap-1 flex-1">
          <Link
            href={`/shop/${product.handle}`}
            className="text-sm font-semibold text-banner hover:text-secondary transition line-clamp-2 leading-snug"
          >
            {product.title}
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary font-bold text-base">
              {fmt(firstVariant?.price?.amount ?? product.price?.amount, firstVariant?.price?.currencyCode ?? product.price?.currencyCode)}
            </span>
            {firstVariant?.compareAtPrice?.amount &&
              parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price?.amount) && (
              <span className="text-red-400 text-sm line-through">
                {fmt(firstVariant.compareAtPrice.amount, firstVariant.compareAtPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>

        {canAdd ? (
          <button
            onClick={async () => {
              setAddError(null)
              const err = await addItem(firstVariant.id, 1)
              if (err) { setAddError(err); setLocalAvailable(false) }
            }}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-white text-xs font-semibold py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50 ${isPreOrder ? 'bg-primary hover:bg-orange-500' : 'bg-banner hover:bg-primary'}`}
          >
            <ShoppingBag size={14} />
            {isPreOrder ? 'Pre Order Now' : 'Add to Cart'}
          </button>
        ) : (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 text-xs font-semibold py-2.5 rounded-sm cursor-not-allowed"
          >
            {available ? 'Max Qty in Cart' : 'Sold Out'}
          </button>
        )}
        {addError && (
          <p className="text-red-500 text-xs text-center mt-1">{addError}</p>
        )}
      </div>

    </div>
  )
}
