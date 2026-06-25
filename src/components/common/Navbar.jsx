import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FiShoppingCart, FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiPackage } from "react-icons/fi"
import { useAuth } from "@/context/AuthContext.jsx"
import { useCart } from "@/context/CartContext.jsx"
import { useTheme } from "@/context/ThemeContext.jsx"
import CartDrawer from "@/components/cart/CartDrawer.jsx"

const NAV_LINKS = [
  { label: "Home",     to: "/" },
  { label: "Menu",     to: "/products" },
  { label: "About",    to: "/about" },
  { label: "Services", to: "/services" },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount, toggleCart } = useCart()
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const handleLogout = () => {
    logout()
    setUserDropdown(false)
    navigate("/")
  }

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-md" : "bg-white dark:bg-dark-bg"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary-500">
            <span className="text-2xl">🍔</span> FoodHub
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `nav-link text-sm font-medium ${isActive ? "text-primary-500 font-semibold" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Cart"
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserDropdown(p => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{user.name}</span>
                </button>

                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl shadow-xl overflow-hidden"
                    >
                      {user.role === "admin" && (
                        <Link to="/admin" onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary-50 dark:hover:bg-dark-bg text-primary-600 font-medium transition-colors">
                          <FiPackage size={16} /> Admin Panel
                        </Link>
                      )}
                      <Link to="/dashboard" onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-dark-bg text-gray-700 dark:text-gray-300 transition-colors">
                        <FiUser size={16} /> My Dashboard
                      </Link>
                      <Link to="/dashboard/orders" onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-dark-bg text-gray-700 dark:text-gray-300 transition-colors">
                        <FiPackage size={16} /> My Orders
                      </Link>
                      <hr className="border-gray-100 dark:border-dark-border" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors">
                        <FiLogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(p => !p)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-600 dark:text-gray-300 transition-colors"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-bg overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-1">
                {NAV_LINKS.map(link => (
                  <NavLink key={link.to} to={link.to} end={link.to === "/"} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <hr className="border-gray-100 dark:border-dark-border my-2" />
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface">My Dashboard</Link>
                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-primary-600">Admin Panel</Link>
                    )}
                    <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="px-4 py-3 rounded-xl text-sm font-medium text-red-500 text-left">Logout</button>
                  </>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium">Sign Up</Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer />

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}
