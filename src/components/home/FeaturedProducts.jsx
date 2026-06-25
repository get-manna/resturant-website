import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"
import { getProducts } from "@/data/products.js"
import ProductCard from "@/components/products/ProductCard.jsx"
import { gsap } from "@/utils/gsap.js"

export default function FeaturedProducts() {
  const sectionRef = useRef(null)
  const featured = getProducts().filter(p => p.isFeatured && p.isAvailable !== false).slice(0, 8)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".featured-heading", {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
      })
      gsap.from(".featured-card", {
        opacity: 0, y: 50, stagger: 0.08, duration: 0.65, ease: "power3.out",
        scrollTrigger: { trigger: ".featured-grid", start: "top 85%", once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="featured-heading flex items-end justify-between mb-12">
          <div>
            <p className="text-primary-500 font-semibold text-sm uppercase tracking-wider mb-2">Chef&apos;s Selection</p>
            <h2 className="section-title">Featured Dishes</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-primary-500 hover:text-primary-700 font-semibold transition-colors">
            View All <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="featured-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <div key={product.id} className="featured-card">
              <ProductCard product={product} />
            </div>
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
