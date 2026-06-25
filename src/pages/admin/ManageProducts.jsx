import { useState } from "react"
import { Link } from "react-router-dom"
import { PRODUCTS } from "@/data/products.js"
import { CATEGORIES } from "@/data/categories.js"
import { formatPrice } from "@/utils/formatCurrency.js"
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi"
import Modal from "@/components/common/Modal.jsx"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"

function getDynamicCategories() {
  try { return JSON.parse(localStorage.getItem("foodhub_categories") || "null") || CATEGORIES }
  catch { return CATEGORIES }
}

export default function ManageProducts() {
  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("foodhub_products") || "null") || PRODUCTS }
    catch { return PRODUCTS }
  })
  const categories = getDynamicCategories()
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("")
  const [deleteId, setDeleteId] = useState(null)

  const saveProducts = (list) => {
    setProducts(list)
    localStorage.setItem("foodhub_products", JSON.stringify(list))
  }

  const handleDelete = () => {
    saveProducts(products.filter(p => p.id !== deleteId))
    setDeleteId(null)
    toast.success("Product deleted")
  }

  const toggleAvailable = (id) => {
    saveProducts(products.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
  }

  const matchesCategory = (p) => {
    if (!catFilter) return true
    if (p.category === catFilter) return true
    if (Array.isArray(p.categories) && p.categories.includes(catFilter)) return true
    return false
  }

  const filtered = products.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    matchesCategory(p)
  )

  const getCategoryName = (p) => {
    const catId = p.category
    return categories.find(c => c.id === catId)?.name || catId
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-display font-bold text-white">Manage Products</h1>
        <Link to="/admin/products/new" className="flex items-center gap-2 bg-primary-500 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-gray-800 border border-dark-border rounded-xl px-3 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm cursor-pointer">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-dark-border/50 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.name} className="h-10 w-10 rounded-xl object-cover flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-200 line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 capitalize">{getCategoryName(p)}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-white">{formatPrice(p.discountPrice ?? p.price)}</div>
                    {p.discountPrice && <div className="text-xs text-gray-500 line-through">{formatPrice(p.price)}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{p.stock}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleAvailable(p.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${p.isAvailable ? "bg-green-900/30 text-green-400 hover:bg-red-900/20 hover:text-red-400" : "bg-red-900/30 text-red-400 hover:bg-green-900/20 hover:text-green-400"}`}>
                      {p.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link to={`/admin/products/${p.id}/edit`} className="p-2 rounded-xl text-gray-400 hover:bg-blue-900/20 hover:text-blue-400 transition-colors">
                        <FiEdit2 size={14} />
                      </Link>
                      <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-xl text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-gray-500">No products found</p>
          )}
        </div>
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <p className="text-gray-400 mb-6">This product will be permanently removed. This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
