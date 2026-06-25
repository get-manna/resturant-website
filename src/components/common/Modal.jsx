import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { FiX } from "react-icons/fi"

const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative z-10 w-full ${sizes[size]} bg-white dark:bg-dark-surface rounded-2xl shadow-xl`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-dark-text">{title}</h3>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-500 transition-colors">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
