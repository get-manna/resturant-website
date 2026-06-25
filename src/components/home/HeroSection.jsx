import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FiArrowRight, FiStar, FiClock, FiPackage } from "react-icons/fi"

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }
const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }

const STATS = [
  { icon: FiPackage, label: "Menu Items",     value: "500+" },
  { icon: FiStar,    label: "Average Rating", value: "4.9★" },
  { icon: FiClock,   label: "Delivery Time",  value: "30 Min" },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/30 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-60" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-50 dark:bg-primary-900/10 blur-3xl opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-16">
        {/* Left Content */}
        <motion.div variants={container} initial="hidden" animate="visible" className="text-center lg:text-left">
          <motion.div variants={item} className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🔥 Fast delivery in your city
          </motion.div>

          <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-gray-900 dark:text-dark-text leading-tight mb-6">
            Order
            <span className="text-primary-500"> Delicious </span>
            Food Online
          </motion.h1>

          <motion.p variants={item} className="text-lg text-gray-500 dark:text-dark-muted max-w-xl mx-auto lg:mx-0 mb-8">
            From gourmet burgers to fresh sushi — discover hundreds of dishes prepared by top chefs and delivered hot to your door.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
            <Link to="/products" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
              Order Now <FiArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-outline flex items-center gap-2 text-base px-8 py-3.5">
              Learn More
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="flex flex-wrap gap-6 justify-center lg:justify-start">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <Icon size={20} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-gray-900 dark:text-dark-text">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-muted">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="relative mx-auto max-w-lg">
            {/* Circular backdrop */}
            <div className="absolute inset-4 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80"
              alt="Delicious food"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-[480px]"
            />
            {/* Floating card */}
            <motion.div
              animate={{ y: [-8, 8, -8] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-4 flex items-center gap-3"
            >
              <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-dark-text">Lava Cake</p>
                <p className="text-primary-500 font-bold text-sm">$8.99</p>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [8, -8, 8] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-4 -right-4 bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-3 flex items-center gap-2"
            >
              <FiStar className="text-yellow-400 fill-yellow-400" size={18} />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-dark-text">4.9 Rating</p>
                <p className="text-xs text-gray-500 dark:text-dark-muted">2.4k reviews</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
