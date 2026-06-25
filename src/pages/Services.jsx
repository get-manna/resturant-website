import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { FiTruck, FiShoppingBag, FiZap, FiShield, FiClock, FiStar } from "react-icons/fi"
import { Link } from "react-router-dom"
import { gsap } from "@/utils/gsap.js"

const SERVICES = [
  {
    icon: FiTruck, title: "Home Delivery",
    desc: "Get fresh hot food delivered straight to your door. We cover the entire city with real-time tracking.",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
  },
  {
    icon: FiShoppingBag, title: "Pickup Order",
    desc: "Skip the wait — order ahead and pick up your food at the restaurant when it's ready.",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-500",
  },
  {
    icon: FiZap, title: "Express Delivery",
    desc: "Need it fast? Our express option gets your order to you in under 20 minutes.",
    color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500",
  },
  {
    icon: FiShield, title: "Safe & Hygienic",
    desc: "All our partners follow strict hygiene protocols. Your food is sealed and contactless delivery available.",
    color: "bg-green-50 dark:bg-green-900/20 text-green-500",
  },
]

const BENEFITS = [
  { icon: FiClock,  label: "Under 30 Min",  sub: "Average delivery time" },
  { icon: FiStar,   label: "4.9/5 Rating",  sub: "Customer satisfaction" },
  { icon: FiTruck,  label: "Free Delivery", sub: "Orders over $50" },
  { icon: FiShield, label: "Safe Handling", sub: "Certified partners" },
]

export default function Services() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } })
      heroTl.from(".svc-hero-sub",   { opacity: 0, y: 20, duration: 0.5 })
            .from(".svc-hero-title", { opacity: 0, y: 35, duration: 0.65 }, "-=0.2")
            .from(".svc-hero-desc",  { opacity: 0, y: 25, duration: 0.6 },  "-=0.35")

      // Service cards
      gsap.from(".svc-card", {
        opacity: 0, y: 50, stagger: 0.1, duration: 0.65, ease: "power3.out",
        scrollTrigger: { trigger: ".svc-grid", start: "top 85%", once: true },
      })

      // How It Works
      gsap.from(".how-heading", {
        opacity: 0, y: 30, duration: 0.65, ease: "power3.out",
        scrollTrigger: { trigger: ".how-section", start: "top 82%", once: true },
      })
      gsap.from(".how-step", {
        opacity: 0, y: 40, scale: 0.92, stagger: 0.15, duration: 0.65, ease: "back.out(1.3)",
        scrollTrigger: { trigger: ".how-grid", start: "top 85%", once: true },
      })

      // Benefits
      gsap.from(".benefit-heading", {
        opacity: 0, y: 30, duration: 0.65, ease: "power3.out",
        scrollTrigger: { trigger: ".benefits-section", start: "top 82%", once: true },
      })
      gsap.from(".benefit-card", {
        opacity: 0, scale: 0.88, stagger: 0.1, duration: 0.6, ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".benefits-grid", start: "top 85%", once: true },
      })

      // CTA
      gsap.from(".svc-cta-inner", {
        opacity: 0, y: 35, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".svc-cta", start: "top 85%", once: true },
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.div ref={pageRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white dark:from-dark-surface dark:to-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="svc-hero-sub text-primary-500 font-semibold text-sm uppercase tracking-wider mb-3">What We Offer</p>
          <h1 className="svc-hero-title section-title mb-6">Our Services</h1>
          <p className="svc-hero-desc text-gray-500 dark:text-dark-muted text-lg">
            Whether you want food delivered to your door or prefer to pick it up, FoodHub has you covered with flexible, reliable options.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="svc-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((svc) => (
              <div key={svc.title} className="svc-card card p-7">
                <div className={`h-14 w-14 rounded-2xl ${svc.color} flex items-center justify-center mb-5`}>
                  <svc.icon size={26} />
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-dark-text text-lg mb-3">{svc.title}</h3>
                <p className="text-gray-500 dark:text-dark-muted text-sm leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section py-20 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="how-heading text-center mb-14">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Order in 3 simple steps</p>
          </div>
          <div className="how-grid grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-primary-200 dark:bg-primary-900/30" />
            {[
              { step: "01", emoji: "🔍", title: "Browse Menu",    desc: "Explore hundreds of dishes across 8 cuisines and filter by your cravings." },
              { step: "02", emoji: "🛒", title: "Add to Cart",    desc: "Select your items, customize your order, and apply any available coupons." },
              { step: "03", emoji: "🚀", title: "Get Delivered",  desc: "Pay securely and track your order in real time right to your door." },
            ].map((s) => (
              <div key={s.step} className="how-step text-center relative">
                <div className="relative inline-flex h-24 w-24 rounded-full bg-white dark:bg-dark-bg shadow-lg border-4 border-primary-100 dark:border-primary-900/30 items-center justify-center mx-auto mb-5 text-4xl">
                  {s.emoji}
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">{s.step}</span>
                </div>
                <h4 className="font-display font-bold text-gray-900 dark:text-dark-text text-lg mb-2">{s.title}</h4>
                <p className="text-gray-500 dark:text-dark-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits-section py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="benefit-heading text-center mb-12">
            <h2 className="section-title">Service Benefits</h2>
          </div>
          <div className="benefits-grid grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.label} className="benefit-card card p-6 text-center">
                <div className="h-12 w-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3">
                  <b.icon size={22} className="text-primary-500" />
                </div>
                <p className="font-bold text-gray-900 dark:text-dark-text">{b.label}</p>
                <p className="text-xs text-gray-500 dark:text-dark-muted mt-1">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="svc-cta py-16 bg-primary-500">
        <div className="svc-cta-inner max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-primary-100 mb-8">Browse our full menu and get your first order delivered in minutes.</p>
          <Link to="/products" className="bg-white text-primary-600 hover:bg-primary-50 font-bold px-8 py-3.5 rounded-xl inline-block transition-colors">
            Browse Menu
          </Link>
        </div>
      </section>
    </motion.div>
  )
}
