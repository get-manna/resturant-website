import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CATEGORIES } from "@/data/categories.js"

export default function PopularCategories() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary-500 font-semibold text-sm uppercase tracking-wider mb-2">Explore Our Menu</p>
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-subtitle">Browse through our diverse range of culinary delights</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} viewport={{ once: true }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-dark-bg hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-100 dark:border-dark-border hover:border-primary-200 transition-all duration-200 text-center"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-dark-text group-hover:text-primary-600 transition-colors">{cat.name}</p>
                  <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">{cat.productCount} items</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
