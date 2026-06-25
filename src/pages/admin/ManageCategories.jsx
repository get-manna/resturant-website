import { useState } from "react"
import { CATEGORIES } from "@/data/categories.js"
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi"
import Modal from "@/components/common/Modal.jsx"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"

function getCategories() {
  try { return JSON.parse(localStorage.getItem("foodhub_categories") || "null") || CATEGORIES }
  catch { return CATEGORIES }
}
function saveCategories(list) { localStorage.setItem("foodhub_categories", JSON.stringify(list)) }

function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

const EMPTY = { name: "", slug: "", icon: "🍽️", image: "", isActive: true }

export default function ManageCategories() {
  const [categories, setCategories] = useState(getCategories)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [deleteId, setDeleteId] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (cat) => {
    setEditing(cat.id)
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || "🍽️", image: cat.image || "", isActive: cat.isActive ?? true })
    setModalOpen(true)
  }

  const handleNameChange = (val) => {
    setForm(f => ({ ...f, name: val, slug: editing ? f.slug : toSlug(val) }))
  }

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Category name is required"); return }
    const slug = form.slug.trim() || toSlug(form.name)
    const slugExists = categories.some(c => c.slug === slug && c.id !== editing)
    if (slugExists) { toast.error("A category with this slug already exists"); return }

    const cat = {
      id:           editing || uuidv4(),
      name:         form.name.trim(),
      slug,
      icon:         form.icon || "🍽️",
      image:        form.image.trim() || "",
      productCount: editing ? (categories.find(c => c.id === editing)?.productCount || 0) : 0,
      isActive:     form.isActive,
    }
    const updated = editing ? categories.map(c => c.id === editing ? cat : c) : [cat, ...categories]
    setCategories(updated)
    saveCategories(updated)
    setModalOpen(false)
    toast.success(editing ? "Category updated!" : "Category created!")
  }

  const handleDelete = () => {
    const updated = categories.filter(c => c.id !== deleteId)
    setCategories(updated)
    saveCategories(updated)
    setDeleteId(null)
    toast.success("Category deleted")
  }

  const toggleActive = (id) => {
    const updated = categories.map(c => c.id === id ? { ...c, isActive: !(c.isActive ?? true) } : c)
    setCategories(updated)
    saveCategories(updated)
  }

  const inputCls = "w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">Manage Categories</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-gray-800 border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                {["Category", "Slug", "Products", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-dark-border/50 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">{cat.icon}</div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-200">{cat.name}</p>
                        <p className="text-xs text-gray-500">{cat.icon}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{cat.slug}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{cat.productCount || 0}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(cat.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${(cat.isActive ?? true)
                        ? "bg-green-900/30 text-green-400 hover:bg-red-900/20 hover:text-red-400"
                        : "bg-red-900/30 text-red-400 hover:bg-green-900/20 hover:text-green-400"}`}>
                      {(cat.isActive ?? true) ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(cat)}
                        className="p-2 rounded-xl text-gray-400 hover:bg-blue-900/20 hover:text-blue-400 transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(cat.id)}
                        className="p-2 rounded-xl text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <p className="text-center py-8 text-gray-500">No categories found</p>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "Create Category"} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Category Name *</label>
            <input value={form.name} onChange={e => handleNameChange(e.target.value)}
              placeholder="e.g. Burgers" className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Slug / URL</label>
            <input value={form.slug} onChange={e => set("slug", e.target.value)}
              placeholder="e.g. burgers" className={`${inputCls} font-mono text-sm`} />
            <p className="text-xs text-gray-500 mt-1">Auto-generated from name. Lowercase letters, numbers, and hyphens only.</p>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Icon (Emoji)</label>
            <input value={form.icon} onChange={e => set("icon", e.target.value)}
              placeholder="🍔" className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Image URL (Optional)</label>
            <input value={form.image} onChange={e => set("image", e.target.value)}
              placeholder="https://..." className={inputCls} />
            {form.image && (
              <img src={form.image} alt="preview" className="mt-2 h-16 w-24 object-cover rounded-xl" />
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => set("isActive", e.target.checked)}
              className="accent-primary-500 h-4 w-4" />
            <span className="text-sm text-gray-300">Active</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>{editing ? "Save Changes" : "Create"}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Category" size="sm">
        <p className="text-gray-400 mb-6">
          This category will be permanently removed. Products assigned to it will retain their category value.
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
