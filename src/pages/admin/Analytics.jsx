import { useOrders } from "@/context/OrderContext.jsx"
import { buildAnalyticsData } from "@/utils/orderHelpers.js"
import { formatPrice } from "@/utils/formatCurrency.js"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts"

const PIE_COLORS = ["#E53935", "#EF5350", "#FF5252", "#FF1744", "#B71C1C", "#F59E0B", "#10B981"]

export default function Analytics() {
  const { getAllOrders } = useOrders()
  const orders = getAllOrders()
  const { dailyOrders, revenue30, topProducts, totalRevenue } = buildAnalyticsData(orders)

  const completedOrders = orders.filter(o => o.status === "Completed").length
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

  // Category breakdown for pie
  const catMap = {}
  orders.forEach(o => {
    if (o.status === "Cancelled") return
    o.items.forEach(item => {
      catMap[item.productId] = (catMap[item.productId] || 0) + item.price * item.quantity
    })
  })
  const categoryPie = Object.entries(catMap).slice(0, 6).map(([name, value]) => ({
    name: name.slice(0, 12),
    value: parseFloat(value.toFixed(2)),
  }))

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-gray-800 border border-dark-border rounded-2xl p-5 ${className}`}>
      <h3 className="font-display font-bold text-white mb-4">{title}</h3>
      {children}
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-white">Analytics</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",    value: formatPrice(totalRevenue) },
          { label: "Total Orders",     value: orders.length },
          { label: "Completed Orders", value: completedOrders },
          { label: "Avg Order Value",  value: formatPrice(avgOrderValue) },
        ].map(s => (
          <div key={s.label} className="bg-gray-800 border border-dark-border rounded-2xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue line */}
      <ChartCard title="Revenue Over Last 30 Days">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenue30.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
            <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} tickFormatter={v => `$${v}`} />
            <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 8, color: "#F9FAFB" }} formatter={v => [`$${v}`, "Revenue"]} />
            <Line type="monotone" dataKey="revenue" stroke="#E53935" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#E53935" }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders bar */}
        <ChartCard title="Orders by Day (Last 7 Days)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 8, color: "#F9FAFB" }} />
              <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: 12 }} />
              <Bar dataKey="completed" name="Completed" fill="#E53935" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending"   name="Pending"   fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#6B7280" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue pie */}
        <ChartCard title="Revenue by Product">
          {categoryPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {categoryPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 8, color: "#F9FAFB" }} formatter={v => [`$${v}`, "Revenue"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-500 text-sm text-center py-10">No revenue data yet</p>}
        </ChartCard>
      </div>

      {/* Top products */}
      <ChartCard title="Top Products by Orders">
        {topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} width={120} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 8, color: "#F9FAFB" }} formatter={v => [v, "Orders"]} />
              <Bar dataKey="orders" fill="#E53935" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-gray-500 text-sm text-center py-10">No order data yet</p>}
      </ChartCard>
    </div>
  )
}
