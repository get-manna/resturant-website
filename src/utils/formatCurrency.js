import { CURRENCY, CURRENCY_SYMBOL } from "@/constants/config.js"

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY }).format(amount)
}

export function formatPrice(amount) {
  return `${CURRENCY_SYMBOL}${Number(amount).toFixed(2)}`
}
