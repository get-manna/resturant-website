export default function Loader({ fullScreen = false, size = "md" }) {
  const sizes = { sm: "h-6 w-6 border-2", md: "h-10 w-10 border-3", lg: "h-16 w-16 border-4" }
  const spinner = (
    <div className={`rounded-full border-gray-200 dark:border-dark-border border-t-primary-500 animate-spin ${sizes[size] ?? sizes.md}`} />
  )
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }
  return <div className="flex items-center justify-center p-8">{spinner}</div>
}
