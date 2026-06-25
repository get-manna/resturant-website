import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PRODUCTS } from "@/data/products.js"
import { CATEGORIES } from "@/data/categories.js"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"
import { FiPlus, FiX } from "react-icons/fi"

function getProducts() {
  try { return JSON.parse(localStorage.getItem("foodhub_products") || "null") || PRODUCTS }
  catch { return PRODUCTS }
}
function saveProducts(list) { localStorage.setItem("foodhub_products", JSON.stringify(list)) }

function getCategories() {
  try { return JSON.parse(localStorage.getItem("foodhub_categories") || "null") || CATEGORIES }
  catch { return CATEGORIES }
}

export default function ProductFormPage({ mode = "create" }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const allCategories = getCategories()
  const existing = mode === "edit" ? getProducts().find(p => p.id === id) : null

  const defaultCategories = existing?.categories
    || (existing?.category ? [existing.category] : [])

  const [form, setForm] = useState({
    name:             existing?.name             || "",
    shortDescription: existing?.shortDescription || "",
    categories:       defaultCategories,
    price:            existing?.price            || "",
    discountPrice:    existing?.discountPrice    || "",
    description:      existing?.description      || "",
    stock:            existing?.stock            || 10,
    thumbnail:        existing?.thumbnail        || "",
    gallery:          existing?.gallery          || [],
    isFeatured:       existing?.isFeatured       ?? false,
    isBestSeller:     existing?.isBestSeller     ?? false,
    isAvailable:      existing?.isAvailable      ?? true,
    ingredients:      existing?.ingredients?.join(", ") || "",
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleCategory = (catId) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(catId)
        ? f.categories.filter(c => c !== catId)
        : [...f.categories, catId],
    }))
  }

  const addGalleryUrl = () => {
    if (form.gallery.length >= 4) { toast.error("Maximum 4 gallery images"); return }
    setForm(f => ({ ...f, gallery: [...f.gallery, ""] }))
  }

  const updateGalleryUrl = (idx, val) => {
    setForm(f => ({ ...f, gallery: f.gallery.map((g, i) => i === idx ? val : g) }))
  }

  const removeGalleryUrl = (idx) => {
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.thumbnail) {
      toast.error("Name, price, and thumbnail are required")
      return
    }
    if (form.categories.length === 0) {
      toast.error("Please select at least one category")
      return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const products = getProducts()
    const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const galleryFiltered = form.gallery.filter(g => g.trim())
    const product = {
      id:               mode === "edit" ? id : uuidv4(),
      name:             form.name,
      slug:             existing?.slug || slug,
      category:         form.categories[0],
      categories:       form.categories,
      price:            parseFloat(form.price),
      discountPrice:    form.discountPrice ? parseFloat(form.discountPrice) : null,
      images:           [form.thumbnail, ...galleryFiltered],
      thumbnail:        form.thumbnail,
      gallery:          galleryFiltered,
      shortDescription: form.shortDescription,
      description:      form.description,
      ingredients:      form.ingredients.split(",").map(s => s.trim()).filter(Boolean),
      tags:             [],
      rating:           existing?.rating      || 4.5,
      reviewCount:      existing?.reviewCount || 0,
      stock:            parseInt(form.stock),
      isFeatured:       form.isFeatured,
      isBestSeller:     form.isBestSeller,
      isAvailable:      form.isAvailable,
      createdAt:        existing?.createdAt   || new Date().toISOString(),
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

  const inputCls = "w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-white">
        {mode === "edit" ? "Edit Product" : "Add New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 border border-dark-border rounded-2xl p-6 space-y-5">
        {/* Basic Info */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-400 mb-1.5 block">Product Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="Classic Smash Burger" required className={inputCls} />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm text-gray-400 mb-1.5 block">Short Description</label>
            <input value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)}
              placeholder="A brief one-line summary shown in product cards…" maxLength={150} className={inputCls} />
            <p className="text-xs text-gray-500 mt-1">{form.shortDescription.length}/150 characters</p>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Price ($) *</label>
            <input type="number" step="0.01" value={form.price} onChange={e => set("price", e.target.value)}
              placeholder="12.99" required className={inputCls} />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Discount Price ($)</label>
            <input type="number" step="0.01" value={form.discountPrice} onChange={e => set("discountPrice", e.target.value)}
              placeholder="Optional" className={inputCls} />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Stock</label>
            <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)}
              min="0" className={inputCls} />
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            Categories * <span className="text-gray-500">(select one or more)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allCategories.map(cat => {
              const checked = form.categories.includes(cat.id)
              return (
                <label key={cat.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
                    checked
                      ? "border-primary-500 bg-primary-500/10 text-primary-400"
                      : "border-dark-border bg-gray-700 text-gray-400 hover:border-gray-500"
                  }`}>
                  <input type="checkbox" checked={checked} onChange={() => toggleCategory(cat.id)}
                    className="accent-primary-500 h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm truncate">{cat.icon} {cat.name}</span>
                </label>
              )
            })}
          </div>
          {form.categories.length > 0 && (
            <p className="text-xs text-gray-500 mt-1.5">
              Primary category: <span className="text-primary-400">{allCategories.find(c => c.id === form.categories[0])?.name || form.categories[0]}</span>
            </p>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Thumbnail URL *</label>
          <input value={form.thumbnail} onChange={e => set("thumbnail", e.target.value)}
            placeholder="https://…" required className={inputCls} />
          {form.thumbnail && (
            <img src={form.thumbnail} alt="thumbnail preview" className="mt-2 h-16 w-24 object-cover rounded-xl" />
          )}
        </div>

        {/* Gallery */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">
              Gallery Images <span className="text-gray-500">(up to 4 additional images)</span>
            </label>
            {form.gallery.length < 4 && (
              <button type="button" onClick={addGalleryUrl}
                className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors">
                <FiPlus size={13} /> Add Image
              </button>
            )}
          </div>
          {form.gallery.length === 0 && (
            <p className="text-xs text-gray-600 italic">No gallery images added yet.</p>
          )}
          <div className="space-y-2">
            {form.gallery.map((url, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input value={url} onChange={e => updateGalleryUrl(idx, e.target.value)}
                  placeholder={`Gallery image ${idx + 1} URL`}
                  className="flex-1 px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                {url && (
                  <img src={url} alt={`gallery ${idx + 1}`} className="h-10 w-14 object-cover rounded-lg flex-shrink-0" />
                )}
                <button type="button" onClick={() => removeGalleryUrl(idx)}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors flex-shrink-0">
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description & Ingredients */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} placeholder="Full product description…"
              className={`${inputCls} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-400 mb-1.5 block">Ingredients (comma-separated)</label>
            <input value={form.ingredients} onChange={e => set("ingredients", e.target.value)}
              placeholder="Beef patty, Cheddar, Lettuce…" className={inputCls} />
          </div>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-4">
          {[
            { key: "isFeatured",   label: "Featured"     },
            { key: "isBestSeller", label: "Best Seller"  },
            { key: "isAvailable",  label: "Available"    },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                className="accent-primary-500 h-4 w-4" />
              <span className="text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={() => navigate("/admin/products")}>Cancel</Button>
          <Button type="submit" loading={saving}>
            {mode === "edit" ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
