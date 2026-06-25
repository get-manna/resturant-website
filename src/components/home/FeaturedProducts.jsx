import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"
import { PRODUCTS } from "@/data/products.js"
import ProductCard from "@/components/products/ProductCard.jsx"
import { motion } from "framer-motion"

export default function FeaturedProducts() {
  const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, 8)

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary-500 font-semibold text-sm uppercase tracking-wider mb-2">Chef&apos;s Selection</p>
            <h2 className="section-title">Featured Dishes</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-primary-500 hover:text-primary-700 font-semibold transition-colors">
            View All <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link to="/products" className="btn-outline inline-flex items-center gap-2">
            View All Dishes <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
