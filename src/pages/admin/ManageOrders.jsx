import { useState } from "react"
import { useOrders } from "@/context/OrderContext.jsx"
import { ORDER_STATUSES } from "@/constants/orderStatuses.js"
import { formatPrice } from "@/utils/formatCurrency.js"
import { formatDate } from "@/utils/formatDate.js"
import { StatusBadge } from "@/components/common/Badge.jsx"
import toast from "react-hot-toast"

export default function ManageOrders() {
  const { getAllOrders, updateOrderStatus } = useOrders()
  const [statusFilter, setStatusFilter] = useState("all")
  const orders = getAllOrders()

  const filtered = statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter)

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    toast.success(`Order updated to "${newStatus}"`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-display font-bold text-white">Manage Orders</h1>
        <span className="text-sm text-gray-400">{filtered.length} orders</span>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", ...ORDER_STATUSES].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
              statusFilter === s ? "bg-primary-500 text-white" : "bg-gray-800 border border-dark-border text-gray-400 hover:text-white"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                {["Order ID","Customer","Date","Items","Total","Status","Update"].map(h => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-dark-border/50 hover:bg-white/5">
                  <td className="px-4 py-3 text-sm font-bold text-primary-400">{o.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{o.billing.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{o.items.length}</td>
                  <td className="px-4 py-3 text-sm font-bold text-white">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    {o.status !== "Completed" && o.status !== "Cancelled" && (
                      <select
                        value={o.status}
                        onChange={e => handleStatusChange(o.id, e.target.value)}
                        className="bg-gray-700 border border-dark-border rounded-lg px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
