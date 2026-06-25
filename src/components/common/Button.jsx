import { motion } from "framer-motion"

const variants = {
  primary:   "bg-primary-500 hover:bg-primary-700 text-white shadow-sm",
  secondary: "bg-gray-100 hover:bg-gray-200 dark:bg-dark-surface dark:hover:bg-dark-border text-gray-800 dark:text-dark-text",
  outline:   "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",
  ghost:     "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface",
  danger:    "bg-red-600 hover:bg-red-700 text-white shadow-sm",
}
const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3 text-base rounded-xl",
}

export default function Button({
  children, variant = "primary", size = "md",
  loading = false, disabled = false, icon, className = "", onClick, type = "button", ...props
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] ?? variants.primary}
        ${sizes[size] ?? sizes.md}
        ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : icon ? (
        <span className="text-base leading-none">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
}
