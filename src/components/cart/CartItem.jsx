import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi"
import { useCart } from "@/context/CartContext.jsx"
import { formatPrice } from "@/utils/formatCurrency.js"

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()

  return (
    <div className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-surface">
      <img src={item.thumbnail} alt={item.name} className="h-16 w-16 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-dark-text truncate">{item.name}</p>
        <p className="text-primary-500 font-bold text-sm mt-0.5">{formatPrice(item.price)}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQty(item.productId, item.quantity - 1)}
              className="h-6 w-6 rounded-lg bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <FiMinus size={12} />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-gray-800 dark:text-dark-text">{item.quantity}</span>
            <button
              onClick={() => updateQty(item.productId, item.quantity + 1)}
              className="h-6 w-6 rounded-lg bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <FiPlus size={12} />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.productId)}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
