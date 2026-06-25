import { motion } from "framer-motion"
import { FiHeart, FiAward, FiUsers, FiTruck } from "react-icons/fi"
import { TEAM_MEMBERS } from "@/data/teamMembers.js"

const WHY_US = [
  { icon: FiHeart,  title: "Made With Love",      desc: "Every dish is prepared with passion and the finest ingredients sourced locally." },
  { icon: FiAward,  title: "Award-Winning Chefs", desc: "Our culinary team has earned recognition from top food critics and guides." },
  { icon: FiTruck,  title: "Lightning Fast",      desc: "Average delivery time is under 30 minutes — hot food, every time." },
  { icon: FiUsers,  title: "10,000+ Happy Customers", desc: "Trusted by thousands of food lovers across the city." },
]

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white dark:from-dark-surface dark:to-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.p variants={fade} initial="hidden" animate="visible" className="text-primary-500 font-semibold text-sm uppercase tracking-wider mb-3">Our Story</motion.p>
          <motion.h1 variants={fade} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="section-title mb-6">
            Serving Joy, One Dish at a Time
          </motion.h1>
          <motion.p variants={fade} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-gray-500 dark:text-dark-muted text-lg leading-relaxed">
            FoodHub was born in 2020 from a simple dream: make restaurant-quality food accessible to everyone. Today, we partner with 50+ top chefs and deliver thousands of meals daily across New York City.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card p-8">
            <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text mb-4">Our Mission</h3>
            <p className="text-gray-500 dark:text-dark-muted leading-relaxed">
              To bring people joy through exceptional food — connecting passionate chefs with hungry customers in the most seamless and delightful way possible. We believe great food should be for everyone.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card p-8">
            <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-6">
              <span className="text-2xl">🔭</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text mb-4">Our Vision</h3>
            <p className="text-gray-500 dark:text-dark-muted leading-relaxed">
              To become the most loved food platform in every city — a place where culinary artistry meets cutting-edge technology, creating experiences that go far beyond just a meal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose FoodHub?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((w, i) => (
              <motion.div key={w.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="card p-6 text-center">
                <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <w.icon size={24} className="text-primary-500" />
                </div>
                <h4 className="font-display font-bold text-gray-900 dark:text-dark-text mb-2">{w.title}</h4>
                <p className="text-sm text-gray-500 dark:text-dark-muted leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">The passionate people behind every delicious meal</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="card p-6 text-center">
                <img src={member.avatar} alt={member.name} className="h-24 w-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-primary-100 dark:ring-primary-900/30" />
                <h4 className="font-display font-bold text-gray-900 dark:text-dark-text">{member.name}</h4>
                <p className="text-primary-500 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-xs text-gray-500 dark:text-dark-muted leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  )
}
