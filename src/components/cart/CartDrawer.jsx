import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext.jsx"
import { FiX, FiShoppingBag } from "react-icons/fi"
import { Link } from "react-router-dom"
import { formatPrice } from "@/utils/formatCurrency.js"
import CartItem from "./CartItem.jsx"
import Button from "@/components/common/Button.jsx"

export default function CartDrawer() {
  const { items, isCartOpen, toggleCart, subtotal, total, deliveryFee, couponDiscount, itemCount } = useCart()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={toggleCart}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white dark:bg-dark-bg shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
              <div>
                <h2 className="text-lg font-display font-bold text-gray-900 dark:text-dark-text">Your Cart</h2>
                <p className="text-sm text-gray-500 dark:text-dark-muted">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={toggleCart} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-500 transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
                    <FiShoppingBag size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-dark-text">Your cart is empty</p>
                    <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">Add some delicious items!</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleCart}>
                    <Link to="/products">Browse Menu</Link>
                  </Button>
                </div>
              ) : (
                items.map(item => <CartItem key={item.productId} item={item} />)
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 dark:border-dark-border p-5 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span><span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery</span>
                    <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : <span className="text-green-600">FREE</span>}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-dark-text text-base pt-1 border-t border-gray-100 dark:border-dark-border">
                    <span>Total</span><span className="text-primary-500">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link to="/checkout" onClick={toggleCart}>
                  <Button className="w-full mt-2">Proceed to Checkout</Button>
                </Link>
                <Link to="/products" onClick={toggleCart} className="block text-center text-sm text-gray-500 hover:text-primary-500 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
