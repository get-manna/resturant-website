import { STATUS_COLORS } from "@/constants/orderStatuses.js"

export function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] ?? { bg: "bg-gray-100", text: "text-gray-600" }
  return (
    <span className={`badge ${colors.bg} ${colors.text}`}>{status}</span>
  )
}

export function Badge({ children, color = "gray", className = "" }) {
  const colors = {
    red:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    green:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    blue:   "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    gray:   "bg-gray-100 text-gray-700 dark:bg-dark-surface dark:text-dark-muted",
    primary:"bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
  }
  return (
    <span className={`badge ${colors[color] ?? colors.gray} ${className}`}>{children}</span>
  )
}
