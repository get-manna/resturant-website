import { useState } from "react"
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FiUser, FiPackage, FiFileText, FiSettings, FiLogOut, FiMenu, FiX, FiHome, FiEdit2 } from "react-icons/fi"
import { useAuth } from "@/context/AuthContext.jsx"
import { useTheme } from "@/context/ThemeContext.jsx"
import { FiSun, FiMoon } from "react-icons/fi"

const NAV = [
  { to: "/dashboard",             end: true,  icon: FiUser,     label: "Profile" },
  { to: "/dashboard/edit-profile",end: false, icon: FiEdit2,    label: "Edit Profile" },
  { to: "/dashboard/orders",      end: false, icon: FiPackage,  label: "My Orders" },
  { to: "/dashboard/invoices",    end: false, icon: FiFileText, label: "Invoices" },
  { to: "/dashboard/settings",    end: false, icon: FiSettings, label: "Settings" },
]

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate("/") }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 dark:border-dark-border">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary-500">
          <span className="text-2xl">🍔</span> FoodHub
        </Link>
      </div>

      {/* User info */}
      <div className="p-6 border-b border-gray-100 dark:border-dark-border">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-lg flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-dark-text truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-dark-muted truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
        <Link to="/" className="sidebar-link">
          <FiHome size={18} /> Back to Home
        </Link>
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-gray-100 dark:border-dark-border space-y-1">
        <button onClick={toggleTheme} className="sidebar-link w-full">
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
          <FiLogOut size={18} /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-dark-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 z-50 bg-white dark:bg-dark-surface shadow-2xl lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-600 dark:text-gray-300">
            <FiMenu size={20} />
          </button>
          <Link to="/" className="font-display font-bold text-primary-500">🍔 FoodHub</Link>
          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-600 dark:text-gray-300">
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
