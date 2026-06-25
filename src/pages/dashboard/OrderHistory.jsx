import { Link } from "react-router-dom"
import { FiPackage, FiFileText, FiNavigation } from "react-icons/fi"
import { useAuth } from "@/context/AuthContext.jsx"
import { useOrders } from "@/context/OrderContext.jsx"
import { formatDate } from "@/utils/formatDate.js"
import { formatPrice } from "@/utils/formatCurrency.js"
import { StatusBadge } from "@/components/common/Badge.jsx"

export default function OrderHistory() {
  const { user } = useAuth()
  const { getUserOrders } = useOrders()
  const orders = getUserOrders(user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <FiPackage size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-gray-900 dark:text-dark-text mb-2">No orders yet</h3>
          <p className="text-gray-500 dark:text-dark-muted mb-6">Place your first order to see it here.</p>
          <Link to="/products" className="btn-primary inline-block">Browse Menu</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-primary-500">{order.id}</p>
                  <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="font-bold text-gray-900 dark:text-dark-text">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Items preview */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {order.items.map(item => (
                  <div key={item.productId} className="flex items-center gap-2 flex-shrink-0 bg-gray-50 dark:bg-dark-bg rounded-xl px-3 py-2">
                    <img src={item.thumbnail} alt={item.name} className="h-8 w-8 rounded-lg object-cover" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{item.name} ×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to={`/dashboard/orders/${order.id}/track`} className="flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-700 transition-colors">
                  <FiNavigation size={14} /> Track Order
                </Link>
                <span className="text-gray-200 dark:text-dark-border">|</span>
                <Link to={`/dashboard/invoices`} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  <FiFileText size={14} /> Invoice
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
