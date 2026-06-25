import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { FiFilter, FiX } from "react-icons/fi"
import { PRODUCTS } from "@/data/products.js"
import { CATEGORIES } from "@/data/categories.js"
import ProductCard from "@/components/products/ProductCard.jsx"
import SearchBar from "@/components/common/SearchBar.jsx"
import Pagination from "@/components/common/Pagination.jsx"
import { usePagination } from "@/hooks/usePagination.js"
import { ITEMS_PER_PAGE } from "@/constants/config.js"

const SORT_OPTIONS = [
  { value: "default",     label: "Featured" },
  { value: "price-asc",   label: "Price: Low → High" },
  { value: "price-desc",  label: "Price: High → Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "newest",      label: "Newest" },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const search   = searchParams.get("search")   || ""
  const category = searchParams.get("category") || ""
  const minPrice = Number(searchParams.get("minPrice") || 0)
  const maxPrice = Number(searchParams.get("maxPrice") || 999)
  const sort     = searchParams.get("sort")     || "default"

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    next.delete("page")
    setSearchParams(next)
  }

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (search)   list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    if (category) list = list.filter(p => p.category === category)
    const min = minPrice || 0
    const max = maxPrice || 999
    list = list.filter(p => (p.discountPrice ?? p.price) >= min && (p.discountPrice ?? p.price) <= max)

    if (sort === "price-asc")   list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
    if (sort === "price-desc")  list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price))
    if (sort === "rating-desc") list.sort((a, b) => b.rating - a.rating)
    if (sort === "newest")      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return list
  }, [search, category, minPrice, maxPrice, sort])

  const page = Number(searchParams.get("page") || 1)
  const { currentItems, currentPage, totalPages, goToPage } = usePagination(filtered, ITEMS_PER_PAGE)

  // Sync page
  useMemo(() => {
    if (page !== currentPage) goToPage(page)
  }, [page])

  const handlePage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set("page", p)
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const hasFilters = search || category || minPrice > 0 || maxPrice < 999 || sort !== "default"

  const FiltersPanel = () => (
    <aside className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-gray-900 dark:text-dark-text mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="cat" checked={category === ""} onChange={() => setParam("category", "")} className="accent-primary-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors">All Categories</span>
          </label>
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="cat" checked={category === cat.slug} onChange={() => setParam("category", cat.slug)} className="accent-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors">
                {cat.icon} {cat.name} ({cat.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 dark:border-dark-border" />

      <div>
        <h3 className="font-display font-semibold text-gray-900 dark:text-dark-text mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" min="0" value={minPrice || ""} onChange={e => setParam("minPrice", e.target.value)}
            className="input-field text-sm py-1.5 w-full" />
          <input type="number" placeholder="Max" min="0" value={maxPrice >= 999 ? "" : maxPrice} onChange={e => setParam("maxPrice", e.target.value || "999")}
            className="input-field text-sm py-1.5 w-full" />
        </div>
      </div>

      {hasFilters && (
        <button onClick={() => setSearchParams({})} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
          <FiX size={14} /> Clear All Filters
        </button>
      )}
    </aside>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary-50 to-white dark:from-dark-surface dark:to-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-2">Our Menu</h1>
          <p className="text-gray-500 dark:text-dark-muted">Discover {PRODUCTS.length}+ delicious dishes</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <SearchBar value={search} onChange={v => setParam("search", v)} placeholder="Search dishes…" className="flex-1 min-w-[200px] max-w-sm" />
          <select
            value={sort} onChange={e => setParam("sort", e.target.value)}
            className="input-field w-auto py-2.5 pr-8 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 transition-colors">
            <FiFilter size={16} /> Filters
          </button>
          <p className="text-sm text-gray-500 dark:text-dark-muted ml-auto">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <FiltersPanel />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {currentItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🍽️</p>
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-dark-text mb-2">No dishes found</h3>
                <p className="text-gray-500 dark:text-dark-muted mb-6">Try adjusting your filters or search query.</p>
                <button onClick={() => setSearchParams({})} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentItems.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePage} />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-dark-bg shadow-xl p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-gray-900 dark:text-dark-text">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><FiX size={20} /></button>
            </div>
            <FiltersPanel />
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
