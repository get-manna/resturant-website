import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

export default function StarRating({ rating, max = 5, size = 14, showCount, count }) {
  const stars = Array.from({ length: max }, (_, i) => {
    const val = i + 1
    if (rating >= val) return "full"
    if (rating >= val - 0.5) return "half"
    return "empty"
  })

  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex items-center gap-0.5 text-yellow-400">
        {stars.map((type, i) => (
          type === "full"  ? <FaStar key={i} size={size} /> :
          type === "half"  ? <FaStarHalfAlt key={i} size={size} /> :
                             <FaRegStar key={i} size={size} className="text-gray-300 dark:text-gray-600" />
        ))}
      </span>
      {showCount && count !== undefined && (
        <span className="text-sm text-gray-500 dark:text-dark-muted">({count})</span>
      )}
    </span>
  )
}
