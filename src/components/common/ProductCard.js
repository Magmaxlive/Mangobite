'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingBag } from 'lucide-react'

export default function ProductCard({ product }) {
  const { addItem, loading } = useCart()
  const image = product.images[0]
  const firstVariant = product.variants[0]
  const available = firstVariant?.availableForSale ?? false

  const fmt = (amount, currency) =>
    new Intl.NumberFormat('en-NZ', { style: 'currency', currency: currency || 'NZD' }).format(amount)

  return (
    <div className="flex flex-col group">
      <Link href={`/shop/${product.handle}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
        )}
        {!available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sold Out</span>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-2 pt-4">
        <Link href={`/shop/${product.handle}`} className="text-sm font-semibold text-banner hover:text-secondary transition line-clamp-2">
          {product.title}
        </Link>
        <div className="flex items-center justify-between gap-2">
          <span className="text-primary font-bold text-sm">
            {fmt(product.price?.amount, product.price?.currencyCode)}
          </span>
          <button
            onClick={() => available && firstVariant && addItem(firstVariant.id)}
            disabled={!available || loading}
            className="flex items-center gap-1.5 bg-banner text-white text-xs font-semibold px-3 py-2 hover:opacity-80 transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <ShoppingBag size={13} />
            {available ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  )
}
