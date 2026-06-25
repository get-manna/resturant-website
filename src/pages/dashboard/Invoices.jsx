import { useAuth } from "@/context/AuthContext.jsx"
import { useOrders } from "@/context/OrderContext.jsx"
import { formatDate } from "@/utils/formatDate.js"
import { formatPrice } from "@/utils/formatCurrency.js"
import { generateInvoiceHTML } from "@/utils/orderHelpers.js"
import { FiDownload, FiFileText } from "react-icons/fi"
import { StatusBadge } from "@/components/common/Badge.jsx"

export default function Invoices() {
  const { user } = useAuth()
  const { getUserOrders } = useOrders()
  const orders = getUserOrders(user.id)

  const downloadInvoice = (order) => {
    const html = generateInvoiceHTML(order, user)
    const win = window.open("", "_blank")
    win.document.write(html)
    win.document.close()
    win.print()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Invoices</h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <FiFileText size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-gray-900 dark:text-dark-text mb-2">No invoices yet</h3>
          <p className="text-gray-500 dark:text-dark-muted">Your order invoices will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-bg text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider">Order ID</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-primary-500">{order.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900 dark:text-dark-text">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-4">
                      <button onClick={() => downloadInvoice(order)}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-700 transition-colors">
                        <FiDownload size={14} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
