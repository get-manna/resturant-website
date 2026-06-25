import { createContext, useContext, useMemo, useCallback, useState } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage.js"
import { INITIAL_COUPONS } from "@/data/coupons.js"
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/constants/config.js"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage("foodhub_cart", [])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = Math.max(0, subtotal - couponDiscount + deliveryFee)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  const addItem = useCallback((product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i)
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        thumbnail: product.thumbnail,
        price: product.discountPrice ?? product.price,
        quantity: qty,
      }]
    })
  }, [setItems])

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }, [setItems])

  const updateQty = useCallback((productId, qty) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.productId !== productId))
    } else {
      setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i))
    }
  }, [setItems])

  const clearCart = useCallback(() => {
    setItems([])
    setCouponCode("")
    setCouponDiscount(0)
  }, [setItems])

  const toggleCart = useCallback(() => setIsCartOpen(p => !p), [])

  const applyCoupon = useCallback((code) => {
    const coupons = (() => {
      try { return JSON.parse(localStorage.getItem("foodhub_coupons") || "null") || INITIAL_COUPONS }
      catch { return INITIAL_COUPONS }
    })()
    const coupon = coupons.find(c => c.code === code.toUpperCase() && c.isActive && c.usedCount < c.maxUses)
    if (!coupon) throw new Error("Invalid or expired coupon code")
    if (subtotal < coupon.minOrder) throw new Error(`Minimum order of $${coupon.minOrder} required`)
    const discount = coupon.type === "percentage"
      ? (subtotal * coupon.value) / 100
      : coupon.value
    setCouponCode(coupon.code)
    setCouponDiscount(parseFloat(discount.toFixed(2)))
    return coupon
  }, [subtotal])

  const removeCoupon = useCallback(() => {
    setCouponCode("")
    setCouponDiscount(0)
  }, [])

  return (
    <CartContext.Provider value={{
      items, itemCount, subtotal, deliveryFee, couponDiscount, couponCode, total,
      isCartOpen, addItem, removeItem, updateQty, clearCart, toggleCart, applyCoupon, removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
