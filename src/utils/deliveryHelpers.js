export const DEFAULT_DELIVERY_SETTINGS = {
  baseCharge:   5.00,
  baseDistance: 2,
  perKmRate:    0.75,
}

export function getDeliverySettings() {
  try {
    return JSON.parse(localStorage.getItem("foodhub_delivery_settings") || "null") || DEFAULT_DELIVERY_SETTINGS
  } catch {
    return DEFAULT_DELIVERY_SETTINGS
  }
}

export function saveDeliverySettings(settings) {
  localStorage.setItem("foodhub_delivery_settings", JSON.stringify(settings))
}

function calcBaseFee(distanceKm, settings) {
  const { baseCharge, baseDistance, perKmRate } = settings
  const extra = Math.max(0, (distanceKm || 0) - baseDistance)
  return parseFloat((baseCharge + extra * perKmRate).toFixed(2))
}

export function calcDeliveryFee(distanceKm, user) {
  const settings = getDeliverySettings()

  // Always read fresh user from localStorage to pick up admin changes immediately
  let resolvedUser = user
  if (user?.id) {
    try {
      const stored = JSON.parse(localStorage.getItem("foodhub_users") || "null")
      if (Array.isArray(stored)) {
        const fresh = stored.find(u => u.id === user.id)
        if (fresh) resolvedUser = fresh
      }
    } catch {}
  }

  const ds = resolvedUser?.deliverySettings
  if (ds) {
    if (ds.freeDelivery) return 0
    if (ds.customCharge != null && ds.customCharge !== "")
      return parseFloat(parseFloat(ds.customCharge).toFixed(2))
    const baseFee = calcBaseFee(distanceKm, settings)
    if (ds.discountPercent != null && ds.discountPercent !== "") {
      const pct = parseFloat(ds.discountPercent)
      return parseFloat(Math.max(0, baseFee * (1 - pct / 100)).toFixed(2))
    }
  }

  return calcBaseFee(distanceKm, settings)
}

export function previewFees(settings) {
  const distances = [1, settings.baseDistance, settings.baseDistance * 2, settings.baseDistance * 3, 10]
  return [...new Set(distances)]
    .sort((a, b) => a - b)
    .map(km => ({ km, fee: calcBaseFee(km, settings) }))
}
