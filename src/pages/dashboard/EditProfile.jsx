import { useState } from "react"
import { useAuth } from "@/context/AuthContext.jsx"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"

export default function EditProfile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name:    user.name    || "",
    phone:   user.phone   || "",
    street:  user.address?.street  || "",
    city:    user.address?.city    || "",
    state:   user.address?.state   || "",
    zip:     user.address?.zip     || "",
    country: user.address?.country || "USA",
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error("Name is required"); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    updateProfile({
      name:  form.name,
      phone: form.phone,
      address: { street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country },
    })
    setSaving(false)
    toast.success("Profile updated!")
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Edit Profile</h1>

      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { key: "name",    label: "Full Name",   placeholder: "Jane Smith" },
            { key: "phone",   label: "Phone",       placeholder: "+1 (555) 000-0000" },
            { key: "street",  label: "Street",      placeholder: "123 Main St" },
            { key: "city",    label: "City",        placeholder: "Brooklyn" },
            { key: "state",   label: "State",       placeholder: "NY" },
            { key: "zip",     label: "ZIP",         placeholder: "11201" },
            { key: "country", label: "Country",     placeholder: "USA" },
          ].map(f => (
            <div key={f.key} className={f.key === "name" || f.key === "street" ? "sm:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
              <input value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} className="input-field" />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={saving}>Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
