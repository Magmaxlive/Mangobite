'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateItem, removeItem, loading } = useCart()

  const fmt = (amount, currency) =>
    new Intl.NumberFormat('en-NZ', { style: 'currency', currency: currency || 'NZD' }).format(amount)

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold uppercase text-banner">Your Cart</h2>
          <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-700 transition cursor-pointer">
            <X size={22} />
          </button>
        </div>

        {/* Lines */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {!cart || cart.lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-sm font-medium">Your cart is empty</p>
              <button
                onClick={() => setCartOpen(false)}
                className="text-sm text-banner underline underline-offset-4"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.lines.map(line => (
              <div key={line.id} className="flex gap-4 items-start">
                {line.product.image && (
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                    <Image
                      src={line.product.image.url}
                      alt={line.product.image.altText || line.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${line.product.handle}`}
                    onClick={() => setCartOpen(false)}
                    className="text-sm font-semibold text-banner hover:text-secondary transition line-clamp-2"
                  >
                    {line.product.title}
                  </Link>
                  {line.variantTitle !== 'Default Title' && (
                    <p className="text-xs text-gray-400 mt-0.5">{line.variantTitle}</p>
                  )}
                  <p className="text-sm font-bold text-primary mt-1">
                    {fmt(line.price.amount, line.price.currencyCode)}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => line.quantity > 1 ? updateItem(line.id, line.quantity - 1) : removeItem(line.id)}
                      disabled={loading}
                      className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:border-banner transition cursor-pointer disabled:opacity-40"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{line.quantity}</span>
                    <button
                      onClick={() => updateItem(line.id, line.quantity + 1)}
                      disabled={loading}
                      className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:border-banner transition cursor-pointer disabled:opacity-40"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(line.id)}
                  disabled={loading}
                  className="text-gray-300 hover:text-red-400 transition mt-1 cursor-pointer disabled:opacity-40"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-gray-600 uppercase tracking-wide">Subtotal</span>
              <span className="text-banner text-base">
                {fmt(cart.total?.amount, cart.total?.currencyCode)}
              </span>
            </div>
            <p className="text-xs text-gray-400">Shipping & taxes calculated at checkout</p>
            <a
              href={cart.checkoutUrl}
              className="w-full bg-banner text-white text-center font-semibold py-4 uppercase tracking-wide hover:opacity-90 transition"
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  )
}
