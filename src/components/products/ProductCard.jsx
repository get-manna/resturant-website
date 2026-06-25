import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FiShoppingCart, FiEye } from "react-icons/fi"
import { useCart } from "@/context/CartContext.jsx"
import { formatPrice } from "@/utils/formatCurrency.js"
import StarRating from "@/components/common/StarRating.jsx"
import toast from "react-hot-toast"

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    setAdding(true)
    addItem(product, 1)
    toast.success(`${product.name} added to cart!`)
    await new Promise(r => setTimeout(r, 600))
    setAdding(false)
  }

  const finalPrice = product.discountPrice ?? product.price

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group card overflow-hidden"
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden h-52">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.discountPrice && (
            <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              SALE
            </span>
          )}
          {product.isBestSeller && !product.discountPrice && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">
              BEST SELLER
            </span>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <Link to={`/products/${product.slug}`}
              className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-primary-500 hover:text-white transition-colors shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <FiEye size={16} />
            </Link>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-primary-500 font-medium uppercase tracking-wider mb-1 capitalize">{product.category}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-display font-semibold text-gray-900 dark:text-dark-text hover:text-primary-500 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} size={13} />
          <span className="text-xs text-gray-500 dark:text-dark-muted">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-500">{formatPrice(finalPrice)}</span>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleAddToCart}
            disabled={adding || !product.isAvailable}
            className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
          >
            {adding ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <FiShoppingCart size={14} />
            )}
            {adding ? "Adding…" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
