import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"
import { PRODUCTS } from "@/data/products.js"
import ProductCard from "@/components/products/ProductCard.jsx"
import { motion } from "framer-motion"

export default function BestSellers() {
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4)

  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary-500 font-semibold text-sm uppercase tracking-wider mb-2">Customer Favorites</p>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-primary-500 hover:text-primary-700 font-semibold transition-colors">
            See All <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
