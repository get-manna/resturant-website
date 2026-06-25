import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "@/components/common/Navbar.jsx"
import Footer from "@/components/common/Footer.jsx"
import ProtectedRoute from "@/components/common/ProtectedRoute.jsx"
import AdminRoute from "@/components/common/AdminRoute.jsx"

import Home from "@/pages/Home.jsx"
import About from "@/pages/About.jsx"
import Services from "@/pages/Services.jsx"
import Products from "@/pages/Products.jsx"
import SingleProduct from "@/pages/SingleProduct.jsx"
import Checkout from "@/pages/Checkout.jsx"
import Login from "@/pages/Login.jsx"
import Register from "@/pages/Register.jsx"
import NotFound from "@/pages/NotFound.jsx"

import UserDashboard from "@/pages/dashboard/UserDashboard.jsx"
import Profile from "@/pages/dashboard/Profile.jsx"
import EditProfile from "@/pages/dashboard/EditProfile.jsx"
import OrderHistory from "@/pages/dashboard/OrderHistory.jsx"
import OrderTracking from "@/pages/dashboard/OrderTracking.jsx"
import Invoices from "@/pages/dashboard/Invoices.jsx"
import AccountSettings from "@/pages/dashboard/AccountSettings.jsx"

import AdminDashboard from "@/pages/admin/AdminDashboard.jsx"
import AdminOverview from "@/pages/admin/AdminOverview.jsx"
import ManageProducts from "@/pages/admin/ManageProducts.jsx"
import ManageUsers from "@/pages/admin/ManageUsers.jsx"
import ManageOrders from "@/pages/admin/ManageOrders.jsx"
import Coupons from "@/pages/admin/Coupons.jsx"
import Analytics from "@/pages/admin/Analytics.jsx"
import ProductFormPage from "@/pages/admin/ProductFormPage.jsx"

const DASHBOARD_PATHS = ["/dashboard", "/admin"]
const NO_FOOTER_PATHS = ["/checkout"]

export default function App() {
  const location = useLocation()
  const isDashboard = DASHBOARD_PATHS.some(p => location.pathname.startsWith(p))
  const showFooter = !isDashboard && !NO_FOOTER_PATHS.some(p => location.pathname.startsWith(p))

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<SingleProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected — authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<UserDashboard />}>
                <Route index element={<Profile />} />
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="orders/:orderId/track" element={<OrderTracking />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="settings" element={<AccountSettings />} />
              </Route>
            </Route>

            {/* Admin only */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<AdminOverview />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="products/new" element={<ProductFormPage mode="create" />} />
                <Route path="products/:id/edit" element={<ProductFormPage mode="edit" />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
