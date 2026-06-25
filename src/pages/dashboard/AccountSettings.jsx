import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext.jsx"
import Button from "@/components/common/Button.jsx"
import Modal from "@/components/common/Modal.jsx"
import toast from "react-hot-toast"

export default function AccountSettings() {
  const { user, logout, changePassword } = useAuth()
  const navigate = useNavigate()

  const [pwForm, setPwForm] = useState({ old: "", new: "", confirm: "" })
  const [pwLoading, setPwLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.new.length < 8) { toast.error("New password must be at least 8 characters"); return }
    if (pwForm.new !== pwForm.confirm) { toast.error("Passwords do not match"); return }
    setPwLoading(true)
    await new Promise(r => setTimeout(r, 500))
    try {
      changePassword(pwForm.old, pwForm.new)
      setPwForm({ old: "", new: "", confirm: "" })
      toast.success("Password changed!")
    } catch (err) {
      toast.error(err.message)
    }
    setPwLoading(false)
  }

  const handleDeleteAccount = () => {
    const users = JSON.parse(localStorage.getItem("foodhub_users") || "[]")
    const updated = users.filter(u => u.id !== user.id)
    localStorage.setItem("foodhub_users", JSON.stringify(updated))
    logout()
    navigate("/")
    toast.success("Account deleted.")
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Account Settings</h1>

      {/* Change Password */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-gray-900 dark:text-dark-text mb-5">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { key: "old",     label: "Current Password", placeholder: "Current password" },
            { key: "new",     label: "New Password",     placeholder: "Min 8 characters" },
            { key: "confirm", label: "Confirm Password", placeholder: "Repeat new password" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
              <input type="password" value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder} className="input-field" required />
            </div>
          ))}
          <Button type="submit" loading={pwLoading}>Change Password</Button>
        </form>
      </div>

      {/* Account Info */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-gray-900 dark:text-dark-text mb-3">Account Info</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><span className="font-medium text-gray-800 dark:text-dark-text">Email:</span> {user.email}</p>
          <p><span className="font-medium text-gray-800 dark:text-dark-text">Role:</span> <span className="capitalize">{user.role}</span></p>
          <p><span className="font-medium text-gray-800 dark:text-dark-text">Status:</span> <span className="text-green-600">Active</span></p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border border-red-200 dark:border-red-800/40">
        <h3 className="font-display font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-500 dark:text-dark-muted mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
        <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>Delete Account</Button>
      </div>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account" size="sm">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete your account? All your data, orders, and history will be permanently removed.</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDeleteAccount}>Yes, Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
