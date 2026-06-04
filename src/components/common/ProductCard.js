'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingBag } from 'lucide-react'

export default function ProductCard({ product }) {
  const { addItem, loading, getCartQty } = useCart()
  const firstMedia = product.media?.[0]
  const firstVariant = product.variants[0]
  const available = firstVariant?.availableForSale ?? false
  const cartQty = getCartQty(firstVariant?.id)
  const maxQty = firstVariant?.quantityAvailable ?? Infinity
  const canAdd = available && cartQty < maxQty

  const fmt = (amount, currency) =>
    new Intl.NumberFormat('en-NZ', { style: 'currency', currency: currency || 'NZD' }).format(amount)

  return (
    <div className="flex flex-col h-full border border-gray-100 rounded-2xl shadow-[0_1.2rem_3rem_rgba(0,0,0,0.22)] overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-300 group">

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

        {!available && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-gray-400 px-2 py-1 rounded-sm">Sold Out</span>
          </div>
        )}

        {available && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-secondary px-2 py-1 rounded-sm">In Stock</span>
          </div>
        )}
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
          <span className="text-primary font-bold text-base">
            {fmt(product.price?.amount, product.price?.currencyCode)}
          </span>
        </div>

        {canAdd ? (
          <button
            onClick={() => addItem(firstVariant.id)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-banner text-white text-xs font-semibold py-2.5 rounded-sm hover:bg-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 text-xs font-semibold py-2.5 rounded-sm cursor-not-allowed"
          >
            Sold Out
          </button>
        )}
      </div>

    </div>
  )
}
