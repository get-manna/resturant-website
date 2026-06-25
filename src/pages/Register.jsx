import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from "react-icons/fi"
import { useAuth } from "@/context/AuthContext.jsx"
import Button from "@/components/common/Button.jsx"
import { validateRegisterForm } from "@/utils/validateForm.js"
import toast from "react-hot-toast"

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateRegisterForm(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await register(form)
      toast.success("Account created! Welcome to FoodHub 🎉")
      navigate("/")
    } catch (err) {
      setErrors({ email: err.message })
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ icon: Icon, label, name, type = "text", placeholder, right }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
        <input type={type} value={form[name]} onChange={e => set(name, e.target.value)}
          placeholder={placeholder} className={`input-field pl-10 ${right ? "pr-10" : ""} ${errors[name] ? "border-red-400 focus:ring-red-400" : ""}`}
        />
        {right}
      </div>
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="min-h-[90vh] flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 py-12"
    >
      <div className="w-full max-w-md">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl text-primary-500 mb-4">
              <span className="text-3xl">🍔</span> FoodHub
            </Link>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Create an Account</h1>
            <p className="text-gray-500 dark:text-dark-muted mt-2 text-sm">Join thousands of food lovers today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field icon={FiUser}  label="Full Name"    name="name"     placeholder="Jane Smith" />
            <Field icon={FiMail}  label="Email"        name="email"    placeholder="you@example.com" />
            <Field icon={FiPhone} label="Phone (optional)" name="phone" placeholder="+1 (555) 000-0000" />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input type={showPw ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
                  placeholder="Min 8 characters" className={`input-field pl-10 pr-10 ${errors.password ? "border-red-400" : ""}`} />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                  placeholder="Repeat password" className={`input-field pl-10 ${errors.confirmPassword ? "border-red-400" : ""}`} />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full py-3">Create Account</Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-dark-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-500 hover:text-primary-700 font-semibold transition-colors">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
