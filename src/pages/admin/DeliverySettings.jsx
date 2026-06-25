import { useState } from "react"
import { FiTruck, FiMinus, FiPlus, FiSave } from "react-icons/fi"
import { getDeliverySettings, saveDeliverySettings, DEFAULT_DELIVERY_SETTINGS, previewFees } from "@/utils/deliveryHelpers.js"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"

export default function DeliverySettings() {
  const [settings, setSettings] = useState(getDeliverySettings)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }))

  const adjust = (key, delta, min = 0) => {
    setSettings(s => ({ ...s, [key]: parseFloat(Math.max(min, s[key] + delta).toFixed(2)) }))
  }

  const handleSave = async () => {
    if (settings.baseCharge < 0) { toast.error("Base charge cannot be negative"); return }
    if (settings.baseDistance <= 0) { toast.error("Base distance must be greater than 0"); return }
    if (settings.perKmRate < 0) { toast.error("Per-KM rate cannot be negative"); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    saveDeliverySettings(settings)
    setSaving(false)
    toast.success("Delivery settings saved!")
  }

  const handleReset = () => {
    setSettings(DEFAULT_DELIVERY_SETTINGS)
    toast("Reset to defaults — click Save to apply")
  }

  const fees = previewFees(settings)

  const inputCls = "w-24 text-center px-3 py-2 bg-gray-700 border border-dark-border rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"

  const SettingRow = ({ label, description, keyName, delta, min = 0, prefix = "" }) => (
    <div className="flex items-center justify-between py-4 border-b border-dark-border/60 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-200">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => adjust(keyName, -delta, min)}
          className="h-8 w-8 rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white flex items-center justify-center transition-colors">
          <FiMinus size={13} />
        </button>
        <div className="relative">
          {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>}
          <input
            type="number"
            value={settings[keyName]}
            onChange={e => set(keyName, parseFloat(e.target.value) || 0)}
            className={`${inputCls} ${prefix ? "pl-6" : ""}`}
            step={delta}
            min={min}
          />
        </div>
        <button onClick={() => adjust(keyName, delta)}
          className="h-8 w-8 rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white flex items-center justify-center transition-colors">
          <FiPlus size={13} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
          <FiTruck size={18} />
        </div>
        <h1 className="text-2xl font-display font-bold text-white">Delivery Settings</h1>
      </div>

      {/* Main settings card */}
      <div className="bg-gray-800 border border-dark-border rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-1">Distance-Based Delivery Charges</h2>
        <p className="text-xs text-gray-500 mb-5">
          Delivery fee = Base Charge + (Distance − Base Distance) × Per-KM Rate
        </p>

        <SettingRow
          label="Base Charge"
          description="Delivery fee for the base distance"
          keyName="baseCharge"
          delta={0.5}
          min={0}
          prefix="$"
        />
        <SettingRow
          label="Base Distance (KM)"
          description="Distance covered by the base charge"
          keyName="baseDistance"
          delta={0.5}
          min={0.5}
        />
        <SettingRow
          label="Per-KM Rate"
          description="Additional charge for every KM beyond base distance"
          keyName="perKmRate"
          delta={0.25}
          min={0}
          prefix="$"
        />

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={handleReset} className="text-sm">Reset to Defaults</Button>
          <Button onClick={handleSave} loading={saving} className="flex-1 flex items-center justify-center gap-2">
            <FiSave size={15} /> Save Settings
          </Button>
        </div>
      </div>

      {/* Live preview */}
      <div className="bg-gray-800 border border-dark-border rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Live Fee Preview</h2>
        <div className="space-y-2">
          {fees.map(({ km, fee }) => (
            <div key={km} className="flex items-center justify-between py-2 px-4 rounded-xl bg-gray-700/50">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-12 font-mono">{km} KM</span>
                <div className="flex-1 h-1.5 bg-gray-600 rounded-full overflow-hidden" style={{ width: 120 }}>
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${Math.min(100, (fee / (settings.baseCharge + 10 * settings.perKmRate)) * 100)}%` }}
                  />
                </div>
              </div>
              <span className={`text-sm font-bold ${km <= settings.baseDistance ? "text-green-400" : "text-primary-400"}`}>
                ${fee.toFixed(2)}
                {km <= settings.baseDistance && <span className="text-xs text-gray-500 ml-1.5 font-normal">(base)</span>}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">* Preview updates in real time as you adjust settings above</p>
      </div>

    </div>
  )
}
