import { useState } from "react"
import { INITIAL_COUPONS } from "@/data/coupons.js"
import { formatDate } from "@/utils/formatDate.js"
import { FiPlus, FiTrash2, FiEdit2, FiTag } from "react-icons/fi"
import Modal from "@/components/common/Modal.jsx"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"

function getCoupons() {
  try { return JSON.parse(localStorage.getItem("foodhub_coupons") || "null") || INITIAL_COUPONS } catch { return INITIAL_COUPONS }
}
function saveCoupons(list) { localStorage.setItem("foodhub_coupons", JSON.stringify(list)) }

const EMPTY = { code: "", type: "percentage", value: "", minOrder: 0, maxUses: 100, expiresAt: "", isActive: true }

export default function Coupons() {
  const [coupons, setCoupons] = useState(getCoupons())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit   = (c) => { setEditing(c.id); setForm({ ...c, value: c.value, expiresAt: c.expiresAt?.slice(0, 10) || "" }); setModalOpen(true) }

  const handleSave = () => {
    if (!form.code.trim() || !form.value) { toast.error("Code and value are required"); return }
    const coupon = {
      id:        editing || uuidv4(),
      code:      form.code.toUpperCase(),
      type:      form.type,
      value:     parseFloat(form.value),
      minOrder:  parseFloat(form.minOrder) || 0,
      maxUses:   parseInt(form.maxUses) || 100,
      usedCount: editing ? coupons.find(c => c.id === editing)?.usedCount || 0 : 0,
      isActive:  form.isActive,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    }
    const updated = editing ? coupons.map(c => c.id === editing ? coupon : c) : [coupon, ...coupons]
    setCoupons(updated); saveCoupons(updated)
    setModalOpen(false)
    toast.success(editing ? "Coupon updated!" : "Coupon created!")
  }

  const handleDelete = (id) => {
    const updated = coupons.filter(c => c.id !== id)
    setCoupons(updated); saveCoupons(updated)
    toast.success("Coupon deleted")
  }

  const toggleActive = (id) => {
    const updated = coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    setCoupons(updated); saveCoupons(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">Coupons</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <FiPlus size={16} /> Add Coupon
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(c => (
          <div key={c.id} className="bg-gray-800 border border-dark-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
                  <FiTag size={14} />
                </div>
                <span className="font-bold text-white text-lg tracking-wider">{c.code}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400"><FiEdit2 size={13} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400"><FiTrash2 size={13} /></button>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary-400 mb-2">
              {c.type === "percentage" ? `${c.value}% OFF` : `$${c.value} OFF`}
            </p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Min order: ${c.minOrder}</p>
              <p>Used: {c.usedCount}/{c.maxUses}</p>
              {c.expiresAt && <p>Expires: {formatDate(c.expiresAt)}</p>}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
              <button onClick={() => toggleActive(c.id)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${c.isActive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                {c.isActive ? "Active" : "Inactive"}
              </button>
              <p className="text-xs text-gray-500 capitalize">{c.type}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Coupon" : "Create Coupon"} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Code *</label>
            <input value={form.code} onChange={e => set("code", e.target.value)} placeholder="SAVE10" className="input-field uppercase" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)} className="input-field cursor-pointer">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Value *</label>
              <input type="number" value={form.value} onChange={e => set("value", e.target.value)} placeholder={form.type === "percentage" ? "10" : "5.00"} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Min Order ($)</label>
              <input type="number" value={form.minOrder} onChange={e => set("minOrder", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={e => set("maxUses", e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Expires At</label>
            <input type="date" value={form.expiresAt} onChange={e => set("expiresAt", e.target.value)} className="input-field" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => set("isActive", e.target.checked)} className="accent-primary-500 h-4 w-4" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>{editing ? "Save" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
