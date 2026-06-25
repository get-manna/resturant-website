import { useState } from "react"
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiGrid, FiPackage, FiUsers, FiShoppingBag, FiTag, FiBarChart2,
  FiMenu, FiX, FiLogOut, FiHome, FiSun, FiMoon, FiLayers, FiTruck,
} from "react-icons/fi"
import { useAuth } from "@/context/AuthContext.jsx"
import { useTheme } from "@/context/ThemeContext.jsx"

const NAV = [
  { to: "/admin",             end: true,  icon: FiGrid,        label: "Overview"   },
  { to: "/admin/products",    end: false, icon: FiPackage,     label: "Products"   },
  { to: "/admin/categories",  end: false, icon: FiLayers,      label: "Categories" },
  { to: "/admin/users",       end: false, icon: FiUsers,       label: "Users"      },
  { to: "/admin/orders",      end: false, icon: FiShoppingBag, label: "Orders"     },
  { to: "/admin/coupons",     end: false, icon: FiTag,         label: "Coupons"    },
  { to: "/admin/analytics",   end: false, icon: FiBarChart2,   label: "Analytics"  },
  { to: "/admin/delivery",    end: false, icon: FiTruck,       label: "Delivery"   },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); navigate("/") }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-dark-border flex items-center justify-between">
        <Link to="/" className={`flex items-center gap-2 font-display font-bold text-lg text-primary-400 ${collapsed ? "justify-center" : ""}`}>
          <span className="text-2xl">🍔</span>
          {!collapsed && <span>FoodHub Admin</span>}
        </Link>
        <button onClick={() => setCollapsed(c => !c)} className="hidden lg:block p-1.5 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
          <FiMenu size={16} />
        </button>
      </div>

      <div className={`p-4 border-b border-dark-border ${collapsed ? "hidden lg:flex justify-center" : ""}`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${collapsed ? "justify-center" : ""}
              ${isActive ? "bg-primary-500/20 text-primary-400 font-semibold" : "text-gray-400 hover:bg-white/5 hover:text-white"}`
            }
            title={collapsed ? item.label : ""}
          >
            <item.icon size={18} />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
        <Link to="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all ${collapsed ? "justify-center" : ""}`}>
          <FiHome size={18} /> {!collapsed && <span className="text-sm">Back to Site</span>}
        </Link>
      </nav>

      <div className="p-3 border-t border-dark-border space-y-0.5">
        <button onClick={toggleTheme} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all ${collapsed ? "justify-center" : ""}`}>
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          {!collapsed && <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? "justify-center" : ""}`}>
          <FiLogOut size={18} /> {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-dark-bg">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-gray-900 border-r border-dark-border flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 z-50 bg-gray-900 shadow-2xl lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-dark-border">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-gray-400 hover:text-white">
            <FiMenu size={20} />
          </button>
          <span className="font-display font-bold text-primary-400">Admin Panel</span>
          <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-400 hover:text-white">
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
