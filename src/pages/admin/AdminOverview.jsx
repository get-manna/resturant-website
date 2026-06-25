import { useOrders } from "@/context/OrderContext.jsx"
import { PRODUCTS } from "@/data/products.js"
import { INITIAL_USERS } from "@/data/users.js"
import { formatPrice } from "@/utils/formatCurrency.js"
import { buildAnalyticsData } from "@/utils/orderHelpers.js"
import { formatDate } from "@/utils/formatDate.js"
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign, FiTrendingUp } from "react-icons/fi"
import { StatusBadge } from "@/components/common/Badge.jsx"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts"

export default function AdminOverview() {
  const { getAllOrders } = useOrders()
  const orders = getAllOrders()
  const { dailyOrders, revenue30, totalRevenue } = buildAnalyticsData(orders)

  const users = (() => {
    try { return JSON.parse(localStorage.getItem("foodhub_users") || "null") || INITIAL_USERS } catch { return INITIAL_USERS }
  })()

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: FiDollarSign, color: "bg-primary-50 dark:bg-primary-900/20 text-primary-500", trend: "+12%" },
    { label: "Total Orders",  value: orders.length,             icon: FiShoppingBag, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",    trend: "+8%"  },
    { label: "Total Users",   value: users.length,              icon: FiUsers,       color: "bg-green-50 dark:bg-green-900/20 text-green-500",  trend: "+3%"  },
    { label: "Products",      value: PRODUCTS.length,           icon: FiPackage,     color: "bg-purple-50 dark:bg-purple-900/20 text-purple-500",trend: "0%"  },
  ]

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm">{formatDate(new Date().toISOString())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="bg-gray-800 border border-dark-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center`}>
                <s.icon size={18} />
              </div>
              <span className="text-xs text-green-400 font-semibold flex items-center gap-0.5">
                <FiTrendingUp size={10} /> {s.trend}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-gray-800 border border-dark-border rounded-2xl p-5">
          <h3 className="font-display font-bold text-white mb-4">Revenue (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenue30.filter((_, i) => i % 5 === 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 8, color: "#F9FAFB" }} formatter={v => [`$${v}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#E53935" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders chart */}
        <div className="bg-gray-800 border border-dark-border rounded-2xl p-5">
          <h3 className="font-display font-bold text-white mb-4">Orders (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 8, color: "#F9FAFB" }} />
              <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: 12 }} />
              <Bar dataKey="completed" name="Completed" fill="#E53935" radius={[4,4,0,0]} />
              <Bar dataKey="pending"   name="Pending"   fill="#F59E0B" radius={[4,4,0,0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#6B7280" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-gray-800 border border-dark-border rounded-2xl p-5">
        <h3 className="font-display font-bold text-white mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Order ID","Customer","Items","Total","Status"].map(h => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider py-2.5 px-3 border-b border-dark-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-dark-border/50 hover:bg-white/5">
                  <td className="py-3 px-3 text-sm font-bold text-primary-400">{o.id}</td>
                  <td className="py-3 px-3 text-sm text-gray-300">{o.billing.name}</td>
                  <td className="py-3 px-3 text-sm text-gray-400">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                  <td className="py-3 px-3 text-sm font-bold text-white">{formatPrice(o.total)}</td>
                  <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
