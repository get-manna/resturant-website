import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FiArrowRight, FiStar, FiClock, FiPackage } from "react-icons/fi"
import { gsap } from "@/utils/gsap.js"

const STATS = [
  { icon: FiPackage, label: "Menu Items",     value: "500+",  count: 500,  suffix: "+" },
  { icon: FiStar,    label: "Average Rating", value: "4.9★",  count: null, suffix: "" },
  { icon: FiClock,   label: "Delivery Time",  value: "30 Min",count: 30,   suffix: " Min" },
]

export default function HeroSection() {
  const heroRef  = useRef(null)
  const imageRef = useRef(null)
  const statRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from(".hero-badge",     { opacity: 0, y: -24, duration: 0.55 })
        .from(".hero-title",     { opacity: 0, y: 50,  duration: 0.70 }, "-=0.25")
        .from(".hero-desc",      { opacity: 0, y: 30,  duration: 0.60 }, "-=0.40")
        .from(".hero-btns",      { opacity: 0, y: 24,  duration: 0.50 }, "-=0.35")
        .from(".hero-stat-item", { opacity: 0, y: 22, stagger: 0.12, duration: 0.50 }, "-=0.30")
        .from(imageRef.current,  { opacity: 0, scale: 0.82, x: 50, duration: 0.90, ease: "back.out(1.2)" }, 0.25)

      // Scroll parallax on the right image column
      gsap.to(imageRef.current, {
        yPercent: 14, ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
      })

      // Counter animations for numeric stats
      STATS.forEach((stat, i) => {
        if (stat.count === null) return
        const el = statRefs.current[i]
        if (!el) return
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: stat.count, duration: 1.8, delay: 1.1, ease: "power2.out",
          onStart:  () => { el.textContent = "0" + stat.suffix },
          onUpdate: () => { el.textContent = Math.round(proxy.val) + stat.suffix },
        })
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/30 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-60" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-50 dark:bg-primary-900/10 blur-3xl opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-16">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <div className="hero-badge inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🔥 Fast delivery in your city
          </div>

          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-gray-900 dark:text-dark-text leading-tight mb-6">
            Order
            <span className="text-primary-500"> Delicious </span>
            Food Online
          </h1>

          <p className="hero-desc text-lg text-gray-500 dark:text-dark-muted max-w-xl mx-auto lg:mx-0 mb-8">
            From gourmet burgers to fresh sushi — discover hundreds of dishes prepared by top chefs and delivered hot to your door.
          </p>

          <div className="hero-btns flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
            <Link to="/products" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
              Order Now <FiArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-outline flex items-center gap-2 text-base px-8 py-3.5">
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
            {STATS.map(({ icon: Icon, label, value }, i) => (
              <div key={label} className="hero-stat-item flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <Icon size={20} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-gray-900 dark:text-dark-text">
                    <span ref={el => statRefs.current[i] = el}>{value}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-muted">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image — GSAP parallax target */}
        <div ref={imageRef} className="relative">
          <div className="relative mx-auto max-w-lg">
            <div className="absolute inset-4 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80"
              alt="Delicious food"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-[480px]"
            />
            {/* Floating cards — kept on framer-motion for infinite loop */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-4 -right-4 bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-3 flex items-center gap-2"
            >
              <FiStar className="text-yellow-400 fill-yellow-400" size={18} />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-dark-text">4.9 Rating</p>
                <p className="text-xs text-gray-500 dark:text-dark-muted">2.4k reviews</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
