'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createCart, getCart, addToCart, updateCartLine, removeCartLine, getVariantAvailability } from '@/lib/shopify'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cartWarning, setCartWarning] = useState(null)

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

  const addItem = useCallback(async (variantId, quantity = 1, unlimited = false) => {
    setLoading(true)
    try {
      const c = await ensureCart()
      if (!c) return 'Could not create cart. Please try again.'
      const liveVariant = await getVariantAvailability(variantId)
      if (liveVariant && !liveVariant.availableForSale) {
        return 'Sorry, this product is currently out of stock.'
      }
      let stockWarning = null
      if (!unlimited && liveVariant && !liveVariant.currentlyNotInStock && liveVariant.quantityAvailable !== null) {
        const currentCartQty = cart?.lines?.find(l => l.variantId === variantId)?.quantity ?? 0
        const remaining = liveVariant.quantityAvailable - currentCartQty
        if (remaining <= 0) return 'Sorry, this product is currently out of stock.'
        if (quantity > remaining) {
          quantity = remaining
          stockWarning = `Only ${remaining} item${remaining !== 1 ? 's' : ''} available. Added ${remaining} to your cart.`
        }
      }
      let { cart: updated, userErrors } = await addToCart(c.id, [{ merchandiseId: variantId, quantity }])

      // Cart expired — create a fresh one and retry
      if (userErrors?.some(e => /cart.*exist|exist.*cart/i.test(e.message))) {
        localStorage.removeItem('shopify_cart_id')
        setCart(null)
        const fresh = await createCart()
        if (!fresh) return 'Could not create cart. Please try again.'
        localStorage.setItem('shopify_cart_id', fresh.id)
        setCart(fresh)
        const retry = await addToCart(fresh.id, [{ merchandiseId: variantId, quantity }])
        updated = retry.cart
        userErrors = retry.userErrors
      }

      if (userErrors?.length > 0) return userErrors[0].message
      if (updated) {
        const wasAdded = updated.lines.some(l => l.variantId === variantId && l.quantity > 0)
        if (!wasAdded) return 'Sorry, this product is currently out of stock.'
        setCart(updated)
        setCartOpen(true)
      }
      return stockWarning
    } finally {
      setLoading(false)
    }
  }, [ensureCart])

  const updateItem = useCallback(async (lineId, quantity) => {
    if (!cart) return null
    setLoading(true)
    try {
      const { cart: updated, userErrors } = await updateCartLine(cart.id, [{ id: lineId, quantity }])
      if (userErrors?.length > 0) return userErrors[0].message
      if (updated) {
        const lineStillExists = updated.lines.some(l => l.id === lineId)
        setCart(updated)
        if (!lineStillExists) {
          setCartWarning('A product went out of stock and was removed from your cart.')
          return null
        }
      }
      return null
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
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addItem, updateItem, removeItem, loading, itemCount, getCartQty, cartWarning, setCartWarning }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
