import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-8xl mb-6">🍽️</p>
        <h1 className="text-6xl font-display font-extrabold text-primary-500 mb-4">404</h1>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text mb-4">Page Not Found</h2>
        <p className="text-gray-500 dark:text-dark-muted mb-8">
          Looks like this page got eaten. Let&apos;s get you back to something delicious.
        </p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </motion.div>
  )
}
