import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"
import { getProducts } from "@/data/products.js"
import ProductCard from "@/components/products/ProductCard.jsx"
import { gsap } from "@/utils/gsap.js"

export default function BestSellers() {
  const sectionRef = useRef(null)
  const bestSellers = getProducts().filter(p => p.isBestSeller && p.isAvailable !== false).slice(0, 4)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bestsellers-heading", {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
      })
      gsap.from(".bestseller-card", {
        opacity: 0, y: 50, stagger: 0.1, duration: 0.65, ease: "power3.out",
        scrollTrigger: { trigger: ".bestsellers-grid", start: "top 85%", once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bestsellers-heading flex items-end justify-between mb-12">
          <div>
            <p className="text-primary-500 font-semibold text-sm uppercase tracking-wider mb-2">Customer Favorites</p>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-primary-500 hover:text-primary-700 font-semibold transition-colors">
            See All <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="bestsellers-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <div key={product.id} className="bestseller-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
