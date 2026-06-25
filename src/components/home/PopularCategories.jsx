import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { getCategories } from "@/data/categories.js"
import { getProducts } from "@/data/products.js"
import { gsap } from "@/utils/gsap.js"

export default function PopularCategories() {
  const sectionRef = useRef(null)

  const categories = getCategories().filter(c => c.isActive !== false)
  const products   = getProducts().filter(p => p.isAvailable !== false)

  const countForCategory = (catId) =>
    products.filter(p =>
      p.category === catId ||
      (Array.isArray(p.categories) && p.categories.includes(catId))
    ).length

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cat-heading", {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
      })
      gsap.from(".cat-card", {
        opacity: 0, y: 45, scale: 0.92, stagger: 0.07, duration: 0.65, ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".cat-grid", start: "top 85%", once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cat-heading text-center mb-12">
          <p className="text-primary-500 font-semibold text-sm uppercase tracking-wider mb-2">Explore Our Menu</p>
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-subtitle">Browse through our diverse range of culinary delights</p>
        </div>

        <div className="cat-grid grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="cat-card">
              <Link
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-dark-bg hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-100 dark:border-dark-border hover:border-primary-200 transition-all duration-200 text-center"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-dark-text group-hover:text-primary-600 transition-colors">{cat.name}</p>
                  <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">{countForCategory(cat.id)} items</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
