import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PRODUCTS } from "@/data/products.js"
import { CATEGORIES } from "@/data/categories.js"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"

function getProducts() {
  try { return JSON.parse(localStorage.getItem("foodhub_products") || "null") || PRODUCTS }
  catch { return PRODUCTS }
}
function saveProducts(list) { localStorage.setItem("foodhub_products", JSON.stringify(list)) }

export default function ProductFormPage({ mode = "create" }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = mode === "edit" ? getProducts().find(p => p.id === id) : null

  const [form, setForm] = useState({
    name:          existing?.name          || "",
    category:      existing?.category      || "burgers",
    price:         existing?.price         || "",
    discountPrice: existing?.discountPrice || "",
    description:   existing?.description   || "",
    stock:         existing?.stock         || 10,
    thumbnail:     existing?.thumbnail     || "",
    isFeatured:    existing?.isFeatured    ?? false,
    isBestSeller:  existing?.isBestSeller  ?? false,
    isAvailable:   existing?.isAvailable   ?? true,
    ingredients:   existing?.ingredients?.join(", ") || "",
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.thumbnail) { toast.error("Name, price, and thumbnail are required"); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const products = getProducts()
    const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const product = {
      id:            mode === "edit" ? id : uuidv4(),
      name:          form.name,
      slug:          existing?.slug || slug,
      category:      form.category,
      price:         parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
      images:        [form.thumbnail],
      thumbnail:     form.thumbnail,
      description:   form.description,
      ingredients:   form.ingredients.split(",").map(s => s.trim()).filter(Boolean),
      tags:          [],
      rating:        existing?.rating      || 4.5,
      reviewCount:   existing?.reviewCount || 0,
      stock:         parseInt(form.stock),
      isFeatured:    form.isFeatured,
      isBestSeller:  form.isBestSeller,
      isAvailable:   form.isAvailable,
      createdAt:     existing?.createdAt   || new Date().toISOString(),
    }
    if (mode === "edit") {
      saveProducts(products.map(p => p.id === id ? product : p))
      toast.success("Product updated!")
    } else {
      saveProducts([product, ...products])
      toast.success("Product created!")
    }
    setSaving(false)
    navigate("/admin/products")
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-white">{mode === "edit" ? "Edit Product" : "Add New Product"}</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 border border-dark-border rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-400 mb-1.5 block">Product Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Classic Smash Burger" required
              className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Category *</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Stock</label>
            <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} min="0"
              className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Price ($) *</label>
            <input type="number" step="0.01" value={form.price} onChange={e => set("price", e.target.value)} placeholder="12.99" required
              className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Discount Price ($)</label>
            <input type="number" step="0.01" value={form.discountPrice} onChange={e => set("discountPrice", e.target.value)} placeholder="Optional"
              className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-400 mb-1.5 block">Thumbnail URL *</label>
            <input value={form.thumbnail} onChange={e => set("thumbnail", e.target.value)} placeholder="https://…" required
              className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            {form.thumbnail && <img src={form.thumbnail} alt="preview" className="mt-2 h-16 w-24 object-cover rounded-xl" />}
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Product description…"
              className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-400 mb-1.5 block">Ingredients (comma-separated)</label>
            <input value={form.ingredients} onChange={e => set("ingredients", e.target.value)} placeholder="Beef patty, Cheddar, Lettuce…"
              className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {[
            { key: "isFeatured",   label: "Featured" },
            { key: "isBestSeller", label: "Best Seller" },
            { key: "isAvailable",  label: "Available" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)} className="accent-primary-500 h-4 w-4" />
              <span className="text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={() => navigate("/admin/products")}>Cancel</Button>
          <Button type="submit" loading={saving}>{mode === "edit" ? "Save Changes" : "Create Product"}</Button>
        </div>
      </form>
    </div>
  )
}
