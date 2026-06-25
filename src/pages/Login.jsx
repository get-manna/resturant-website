import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import { useAuth } from "@/context/AuthContext.jsx"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [form, setForm] = useState({ email: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success("Welcome back!")
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="min-h-[90vh] flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 py-12"
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl text-primary-500 mb-4">
              <span className="text-3xl">🍔</span> FoodHub
            </Link>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Welcome back!</h1>
            <p className="text-gray-500 dark:text-dark-muted mt-2 text-sm">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input type={showPw ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required placeholder="••••••••" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full py-3">Sign In</Button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-600 dark:text-blue-400">
            <p className="font-semibold mb-1">Test Credentials:</p>
            <p>Admin: admin@foodhub.com / Admin@123</p>
            <p>User: jane@example.com / Jane@123</p>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-dark-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary-500 hover:text-primary-700 font-semibold transition-colors">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
