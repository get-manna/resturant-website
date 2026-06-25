import { useState } from "react"
import { INITIAL_USERS } from "@/data/users.js"
import { formatDate } from "@/utils/formatDate.js"
import { FiUser, FiToggleLeft, FiToggleRight, FiSearch } from "react-icons/fi"
import toast from "react-hot-toast"

function getUsers() {
  try { return JSON.parse(localStorage.getItem("foodhub_users") || "null") || INITIAL_USERS } catch { return INITIAL_USERS }
}
function saveUsers(list) { localStorage.setItem("foodhub_users", JSON.stringify(list)) }

export default function ManageUsers() {
  const [users, setUsers] = useState(getUsers())
  const [search, setSearch] = useState("")

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
                {["User","Email","Role","Joined","Status","Actions"].map(h => (
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
                  <td className="px-4 py-3 text-sm text-gray-400">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.isActive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleActive(u.id)} title={u.isActive ? "Deactivate" : "Activate"}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        {u.isActive ? <FiToggleRight size={18} className="text-green-400" /> : <FiToggleLeft size={18} />}
                      </button>
                      <button onClick={() => toggleRole(u.id)} title="Toggle role"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <FiUser size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
