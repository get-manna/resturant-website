import { motion } from "framer-motion"

export default function Card({ children, className = "", hoverable = false, onClick }) {
  const base = "card"
  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(229,57,53,0.12)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${base} cursor-pointer ${className}`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }
  return <div className={`${base} ${className}`} onClick={onClick}>{children}</div>
}
