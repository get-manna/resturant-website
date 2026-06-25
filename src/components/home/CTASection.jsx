import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FiArrowRight } from "react-icons/fi"

export default function CTASection() {
  return (
    <section className="py-20 bg-primary-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 text-[20rem] leading-none select-none">🍔</div>
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-6">
            Ready to Order? Join FoodHub Today!
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Sign up now and get 20% off your first order. Over 500 dishes available for delivery or pickup.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register"
              className="bg-white text-primary-600 hover:bg-primary-50 font-bold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transition-colors">
              Get Started Free <FiArrowRight size={18} />
            </Link>
            <Link to="/products"
              className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-3.5 rounded-xl transition-colors">
              Browse Menu
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
