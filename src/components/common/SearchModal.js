'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Loader2 } from 'lucide-react'
import { searchProducts } from '@/lib/shopify'

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  const fmt = (amount, currency) =>
    new Intl.NumberFormat('en-NZ', { style: 'currency', currency: currency || 'NZD' }).format(amount)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      setQuery('')
      setResults([])
      document.body.style.overflow = ''
    }
  }, [open])

  const handleQuery = useCallback((val) => {
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setResults([]); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      const res = await searchProducts(val)
      setResults(res)
      setLoading(false)
    }, 300)
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay — header (z-50) stays above this */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — starts right below the navbar (~104px) */}
      <div className="absolute top-[104px] inset-x-0 bg-white shadow-2xl z-10">
        {/* Search input */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 max-w-3xl mx-auto w-full">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => handleQuery(e.target.value)}
            placeholder="Search for mangoes, products..."
            className="flex-1 text-lg outline-none text-banner placeholder:text-gray-300"
          />
          {loading
            ? <Loader2 size={18} className="text-gray-300 animate-spin flex-shrink-0" />
            : query
            ? <button onClick={() => handleQuery('')} className="text-gray-300 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
            : <button onClick={onClose} className="text-gray-300 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
          }
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-w-3xl mx-auto w-full max-h-[60vh] overflow-y-auto divide-y divide-gray-50">
            {results.map(product => (
              <Link
                key={product.id}
                href={`/shop/${product.handle}`}
                onClick={onClose}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
              >
                <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  {product.image && (
                    <Image src={product.image.url} alt={product.image.altText || product.title} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-banner truncate">{product.title}</p>
                  <p className="text-sm text-primary font-bold mt-0.5">
                    {fmt(product.price?.amount, product.price?.currencyCode)}
                  </p>
                </div>
                {!product.available && (
                  <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-100 px-2 py-1 rounded-sm flex-shrink-0">Sold Out</span>
                )}
              </Link>
            ))}
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No products found for &ldquo;{query}&rdquo;</p>
        )}
      </div>
    </div>
  )
}
