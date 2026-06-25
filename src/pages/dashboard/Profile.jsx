import { Link } from "react-router-dom"
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiPackage, FiEdit2 } from "react-icons/fi"
import { useAuth } from "@/context/AuthContext.jsx"
import { useOrders } from "@/context/OrderContext.jsx"
import { formatDate } from "@/utils/formatDate.js"
import { formatPrice } from "@/utils/formatCurrency.js"
import { StatusBadge } from "@/components/common/Badge.jsx"

export default function Profile() {
  const { user } = useAuth()
  const { getUserOrders } = useOrders()
  const orders = getUserOrders(user.id)
  const totalSpent = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0)
  const recent = orders.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">My Profile</h1>
        <Link to="/dashboard/edit-profile" className="btn-outline text-sm py-2 px-4 inline-flex items-center gap-2">
          <FiEdit2 size={14} /> Edit
        </Link>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start gap-5 mb-6">
          <div className="h-20 w-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-3xl flex-shrink-0">
            {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-2xl" /> : user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-dark-text">{user.name}</h2>
            <span className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mt-1 capitalize">{user.role}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: FiMail,     label: "Email",   value: user.email },
            { icon: FiPhone,    label: "Phone",   value: user.phone || "Not provided" },
            { icon: FiCalendar, label: "Member Since", value: formatDate(user.createdAt) },
            { icon: FiMapPin,   label: "City",    value: user.address?.city || "Not set" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
              <div className="h-9 w-9 rounded-xl bg-white dark:bg-dark-surface flex items-center justify-center text-primary-500 flex-shrink-0">
                <item.icon size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-dark-muted">{item.label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-text">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: orders.length, icon: FiPackage, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
          { label: "Completed",    value: orders.filter(o => o.status === "Completed").length, icon: FiPackage, color: "text-green-500 bg-green-50 dark:bg-green-900/20" },
          { label: "Total Spent",  value: formatPrice(totalSpent), icon: FiPackage, color: "text-primary-500 bg-primary-50 dark:bg-primary-900/20" },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
              <s.icon size={18} />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-dark-text">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-dark-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      {recent.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-gray-900 dark:text-dark-text">Recent Orders</h3>
            <Link to="/dashboard/orders" className="text-sm text-primary-500 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recent.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-dark-text">{o.id}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-muted">{formatDate(o.createdAt)} · {o.items.length} item{o.items.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={o.status} />
                  <span className="text-sm font-bold text-primary-500">{formatPrice(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
