import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaQuoteLeft } from "react-icons/fa"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { TESTIMONIALS } from "@/data/testimonials.js"
import StarRating from "@/components/common/StarRating.jsx"

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent(c => (c + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const go = (dir) => {
    setDirection(dir)
    setCurrent(c => (c + dir + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const t = TESTIMONIALS[current]

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary-500 font-semibold text-sm uppercase tracking-wider mb-2">Happy Customers</p>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={t.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="card p-8 md:p-12 text-center"
            >
              <FaQuoteLeft className="text-primary-200 dark:text-primary-800 text-5xl mx-auto mb-6" />
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 italic">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="flex flex-col items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-16 w-16 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900/30" />
                <div>
                  <p className="font-display font-bold text-gray-900 dark:text-dark-text">{t.name}</p>
                  <p className="text-sm text-gray-500 dark:text-dark-muted">{t.role}</p>
                </div>
                <StarRating rating={t.rating} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <button
            onClick={() => go(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 h-10 w-10 rounded-full bg-white dark:bg-dark-surface shadow-lg border border-gray-100 dark:border-dark-border flex items-center justify-center hover:bg-primary-50 hover:text-primary-500 transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 h-10 w-10 rounded-full bg-white dark:bg-dark-surface shadow-lg border border-gray-100 dark:border-dark-border flex items-center justify-center hover:bg-primary-50 hover:text-primary-500 transition-colors"
          >
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-primary-500" : "w-2 bg-gray-300 dark:bg-dark-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
