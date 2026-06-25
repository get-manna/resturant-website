import { useState } from "react"
import { INITIAL_USERS } from "@/data/users.js"
import { formatDate } from "@/utils/formatDate.js"
import { FiUser, FiToggleLeft, FiToggleRight, FiSearch, FiTruck, FiX } from "react-icons/fi"
import Modal from "@/components/common/Modal.jsx"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"

function getUsers() {
  try { return JSON.parse(localStorage.getItem("foodhub_users") || "null") || INITIAL_USERS } catch { return INITIAL_USERS }
}
function saveUsers(list) { localStorage.setItem("foodhub_users", JSON.stringify(list)) }

const EMPTY_DS = { freeDelivery: false, customCharge: "", discountPercent: "" }

function DeliveryBadge({ ds }) {
  if (!ds) return null
  if (ds.freeDelivery)
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">Free Delivery</span>
  if (ds.customCharge !== "" && ds.customCharge != null)
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400">${parseFloat(ds.customCharge).toFixed(2)} flat</span>
  if (ds.discountPercent !== "" && ds.discountPercent != null)
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-900/30 text-yellow-400">{ds.discountPercent}% off</span>
  return null
}

export default function ManageUsers() {
  const [users, setUsers] = useState(getUsers)
  const [search, setSearch] = useState("")
  const [deliveryModal, setDeliveryModal] = useState(null)
  const [dsForm, setDsForm] = useState(EMPTY_DS)
  const setDs = (k, v) => setDsForm(f => ({ ...f, [k]: v }))

  const toggleActive = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u)
    setUsers(updated); saveUsers(updated)
    toast.success("User status updated")
  }

  const toggleRole = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, role: u.role === "admin" ? "customer" : "admin" } : u)
    setUsers(updated); saveUsers(updated)
    toast.success("User role updated")
  }

  const openDeliveryModal = (u) => {
    const ds = u.deliverySettings || EMPTY_DS
    setDsForm({
      freeDelivery:   ds.freeDelivery   ?? false,
      customCharge:   ds.customCharge   ?? "",
      discountPercent: ds.discountPercent ?? "",
    })
    setDeliveryModal(u)
  }

  const saveDeliverySettings = () => {
    if (!dsForm.freeDelivery) {
      if (dsForm.customCharge !== "" && dsForm.discountPercent !== "") {
        toast.error("Set either a custom charge OR a discount — not both")
        return
      }
      if (dsForm.customCharge !== "" && parseFloat(dsForm.customCharge) < 0) {
        toast.error("Custom charge cannot be negative")
        return
      }
      if (dsForm.discountPercent !== "" && (parseFloat(dsForm.discountPercent) < 0 || parseFloat(dsForm.discountPercent) > 100)) {
        toast.error("Discount must be between 0 and 100%")
        return
      }
    }

    const ds = {
      freeDelivery:    dsForm.freeDelivery,
      customCharge:    dsForm.freeDelivery ? null : (dsForm.customCharge !== "" ? parseFloat(dsForm.customCharge) : null),
      discountPercent: dsForm.freeDelivery ? null : (dsForm.discountPercent !== "" ? parseFloat(dsForm.discountPercent) : null),
    }

    const updated = users.map(u => u.id === deliveryModal.id ? { ...u, deliverySettings: ds } : u)
    setUsers(updated)
    saveUsers(updated)
    setDeliveryModal(null)
    toast.success("Delivery settings saved!")
  }

  const removeDeliveryOverride = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, deliverySettings: null } : u)
    setUsers(updated); saveUsers(updated)
    toast.success("Delivery override removed — standard rates apply")
  }

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-display font-bold text-white">Manage Users</h1>
        <span className="text-sm text-gray-400">{users.length} total users</span>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
          className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
      </div>

      <div className="bg-gray-800 border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                {["User", "Email", "Role", "Delivery", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-dark-border/50 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-purple-900/30 text-purple-400" : "bg-blue-900/30 text-blue-400"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DeliveryBadge ds={u.deliverySettings} />
                    {!u.deliverySettings && <span className="text-xs text-gray-600">Standard</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.isActive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <button onClick={() => toggleActive(u.id)} title={u.isActive ? "Deactivate" : "Activate"}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        {u.isActive ? <FiToggleRight size={18} className="text-green-400" /> : <FiToggleLeft size={18} />}
                      </button>
                      <button onClick={() => toggleRole(u.id)} title="Toggle role"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <FiUser size={14} />
                      </button>
                      <button onClick={() => openDeliveryModal(u)} title="Delivery settings"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-primary-400 transition-colors">
                        <FiTruck size={14} />
                      </button>
                      {u.deliverySettings && (
                        <button onClick={() => removeDeliveryOverride(u.id)} title="Remove delivery override"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                          <FiX size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery Settings Modal */}
      <Modal isOpen={!!deliveryModal} onClose={() => setDeliveryModal(null)}
        title={`Delivery Settings — ${deliveryModal?.name}`} size="sm">
        <div className="space-y-5">
          {/* Free Delivery Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-200">Free Delivery</p>
              <p className="text-xs text-gray-500 mt-0.5">Always $0 regardless of distance</p>
            </div>
            <button onClick={() => setDs("freeDelivery", !dsForm.freeDelivery)}
              className={`relative w-11 h-6 rounded-full transition-colors ${dsForm.freeDelivery ? "bg-green-500" : "bg-gray-600"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${dsForm.freeDelivery ? "translate-x-5" : ""}`} />
            </button>
          </div>

          {!dsForm.freeDelivery && (
            <>
              {/* Custom Charge */}
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Custom Delivery Charge ($)
                  <span className="text-gray-600 ml-1 text-xs">— fixed amount, overrides distance calculation</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={dsForm.customCharge}
                  onChange={e => { setDs("customCharge", e.target.value); setDs("discountPercent", "") }}
                  placeholder="Leave empty to use standard rate"
                  className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="text-center text-xs text-gray-600">— OR —</div>

              {/* Discount */}
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Delivery Discount (%)
                  <span className="text-gray-600 ml-1 text-xs">— % off the calculated delivery fee</span>
                </label>
                <input
                  type="number"
                  step="5"
                  min="0"
                  max="100"
                  value={dsForm.discountPercent}
                  onChange={e => { setDs("discountPercent", e.target.value); setDs("customCharge", "") }}
                  placeholder="e.g. 50 for 50% off"
                  className="w-full px-4 py-2.5 bg-gray-700 border border-dark-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              {/* Quick preset buttons */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Quick presets:</p>
                <div className="flex flex-wrap gap-2">
                  {[25, 50, 75].map(pct => (
                    <button key={pct} onClick={() => { setDs("discountPercent", pct); setDs("customCharge", "") }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${dsForm.discountPercent == pct ? "border-primary-500 bg-primary-500/20 text-primary-400" : "border-dark-border text-gray-400 hover:border-gray-500"}`}>
                      {pct}% off
                    </button>
                  ))}
                  {[0, 1.99, 2.99].map(charge => (
                    <button key={charge} onClick={() => { setDs("customCharge", charge); setDs("discountPercent", "") }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${dsForm.customCharge == charge ? "border-primary-500 bg-primary-500/20 text-primary-400" : "border-dark-border text-gray-400 hover:border-gray-500"}`}>
                      ${charge.toFixed(2)} flat
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1" onClick={() => setDeliveryModal(null)}>Cancel</Button>
            <Button className="flex-1" onClick={saveDeliverySettings}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
