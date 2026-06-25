export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Pickup Available",
  "Received",
  "Completed",
  "Cancelled",
]

export const STATUS_COLORS = {
  "Pending":          { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400" },
  "Confirmed":        { bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-400"   },
  "Preparing":        { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400"},
  "Ready":            { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400"},
  "Pickup Available": { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400"},
  "Received":         { bg: "bg-teal-100 dark:bg-teal-900/30",     text: "text-teal-700 dark:text-teal-400"  },
  "Completed":        { bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-700 dark:text-green-400" },
  "Cancelled":        { bg: "bg-red-100 dark:bg-red-900/30",       text: "text-red-700 dark:text-red-400"    },
}
