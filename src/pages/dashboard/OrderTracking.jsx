import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useOrders } from "@/context/OrderContext.jsx"
import { useAuth } from "@/context/AuthContext.jsx"
import { formatPrice } from "@/utils/formatCurrency.js"
import { formatDateTime } from "@/utils/formatDate.js"
import { isStatusReached } from "@/utils/orderHelpers.js"
import { StatusBadge } from "@/components/common/Badge.jsx"
import { FiArrowLeft } from "react-icons/fi"

const TIMELINE_STATUSES = ["Pending", "Confirmed", "Preparing", "Ready", "Received", "Completed"]

export default function OrderTracking() {
  const { orderId } = useParams()
  const { getOrderById } = useOrders()
  const order = getOrderById(orderId)

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-5xl mb-4">📦</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2">Order not found</h3>
        <Link to="/dashboard/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/orders" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-500 transition-colors">
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Track Order</h1>
      </div>

      {/* Order summary card */}
      <div className="card p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-bold text-primary-500 text-lg">{order.id}</p>
            <p className="text-sm text-gray-500 dark:text-dark-muted">{order.items.length} item{order.items.length !== 1 ? "s" : ""} · {formatPrice(order.total)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {order.items.map(item => (
            <div key={item.productId} className="flex items-center gap-2 bg-gray-50 dark:bg-dark-bg rounded-xl px-3 py-1.5">
              <img src={item.thumbnail} alt={item.name} className="h-7 w-7 rounded-lg object-cover" />
              <span className="text-xs text-gray-700 dark:text-gray-300">{item.name} ×{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-gray-900 dark:text-dark-text mb-6">Order Timeline</h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-dark-border" />

          <div className="space-y-6">
            {TIMELINE_STATUSES.map((status, i) => {
              const reached = isStatusReached(order.status, status)
              const isCurrent = order.status === status
              const event = order.statusHistory.find(h => h.status === status)

              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex items-start gap-5"
                >
                  {/* Dot */}
                  <div className={`relative z-10 h-10 w-10 rounded-full border-4 flex items-center justify-center flex-shrink-0 transition-all ${
                    isCurrent ? "border-primary-500 bg-primary-500 shadow-lg shadow-primary-200 dark:shadow-primary-900/30"
                    : reached  ? "border-green-400 bg-green-400"
                    :            "border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg"
                  }`}>
                    {reached ? (
                      <span className="text-white text-sm">{isCurrent ? "●" : "✓"}</span>
                    ) : (
                      <span className="text-gray-300 text-xs">{i + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-2 ${!reached && !isCurrent ? "opacity-40" : ""}`}>
                    <p className={`font-semibold text-sm ${isCurrent ? "text-primary-500" : reached ? "text-gray-900 dark:text-dark-text" : "text-gray-400"}`}>
                      {status}
                    </p>
                    {event ? (
                      <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">{formatDateTime(event.timestamp)}</p>
                    ) : (
                      <p className="text-xs text-gray-400">Upcoming</p>
                    )}
                    {event?.note && <p className="text-xs text-gray-400 mt-0.5">{event.note}</p>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
