import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext.jsx"
import Loader from "./Loader.jsx"

export default function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== "admin") return <Navigate to="/" replace />
  return <Outlet />
}
