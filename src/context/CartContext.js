'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createCart, getCart, addToCart, updateCartLine, removeCartLine } from '@/lib/shopify'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('shopify_cart_id')
    if (stored) {
      getCart(stored).then(c => {
        if (c) setCart(c)
        else localStorage.removeItem('shopify_cart_id')
      })
    }
  }, [])

  const ensureCart = useCallback(async () => {
    if (cart) return cart
    const c = await createCart()
    if (c) {
      localStorage.setItem('shopify_cart_id', c.id)
      setCart(c)
    }
    return c
  }, [cart])

  const addItem = useCallback(async (variantId, quantity = 1) => {
    setLoading(true)
    try {
      const c = await ensureCart()
      if (!c) return
      const updated = await addToCart(c.id, [{ merchandiseId: variantId, quantity }])
      if (updated) {
        setCart(updated)
        setCartOpen(true)
      }
    } finally {
      setLoading(false)
    }
  }, [ensureCart])

  const updateItem = useCallback(async (lineId, quantity) => {
    if (!cart) return
    setLoading(true)
    try {
      const updated = await updateCartLine(cart.id, [{ id: lineId, quantity }])
      if (updated) setCart(updated)
    } finally {
      setLoading(false)
    }
  }, [cart])

  const removeItem = useCallback(async (lineId) => {
    if (!cart) return
    setLoading(true)
    try {
      const updated = await removeCartLine(cart.id, [lineId])
      if (updated) setCart(updated)
    } finally {
      setLoading(false)
    }
  }, [cart])

  const itemCount = cart?.lines?.reduce((sum, l) => sum + l.quantity, 0) ?? 0

  const getCartQty = useCallback((variantId) => {
    return cart?.lines?.find(l => l.variantId === variantId)?.quantity ?? 0
  }, [cart])

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addItem, updateItem, removeItem, loading, itemCount, getCartQty }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
