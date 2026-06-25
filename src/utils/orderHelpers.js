import { formatPrice } from "./formatCurrency.js"
import { formatDate, formatDateTime } from "./formatDate.js"

export function getStatusIndex(status) {
  const statuses = ["Pending", "Confirmed", "Preparing", "Ready", "Pickup Available", "Received", "Completed"]
  return statuses.indexOf(status)
}

export function isStatusReached(currentStatus, targetStatus) {
  return getStatusIndex(currentStatus) >= getStatusIndex(targetStatus)
}

export function generateOrderId() {
  const num = Math.floor(Math.random() * 900000) + 100000
  return `ORD-${new Date().getFullYear()}${num}`
}

export function calcOrderTotals(items, couponDiscount = 0, freeThreshold = 50, deliveryFee = 5.99) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const fee = subtotal >= freeThreshold ? 0 : deliveryFee
  const total = subtotal - couponDiscount + fee
  return { subtotal, deliveryFee: fee, discount: couponDiscount, total: Math.max(0, total) }
}

export function buildAnalyticsData(orders) {
  const now = new Date()
  // last 7 days bar chart
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    return d.toLocaleDateString("en-US", { weekday: "short" })
  })
  const dailyOrders = days.map((day, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    const dayOrders = orders.filter(o => {
      const od = new Date(o.createdAt)
      return od.toDateString() === d.toDateString()
    })
    return {
      day,
      completed: dayOrders.filter(o => o.status === "Completed").length,
      pending:   dayOrders.filter(o => ["Pending", "Confirmed", "Preparing", "Ready"].includes(o.status)).length,
      cancelled: dayOrders.filter(o => o.status === "Cancelled").length,
    }
  })

  // last 30 days revenue
  const revenue30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (29 - i))
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const dayRevenue = orders
      .filter(o => new Date(o.createdAt).toDateString() === d.toDateString() && o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.total, 0)
    return { date: label, revenue: parseFloat(dayRevenue.toFixed(2)) }
  })

  // category pie
  const categoryMap = {}
  orders.forEach(o => {
    if (o.status === "Cancelled") return
    o.items.forEach(item => {
      categoryMap[item.productId] = (categoryMap[item.productId] || 0) + item.price * item.quantity
    })
  })

  // top products
  const productMap = {}
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!productMap[item.name]) productMap[item.name] = 0
      productMap[item.name] += item.quantity
    })
  })
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, orders]) => ({ name: name.length > 20 ? name.slice(0, 17) + "…" : name, orders }))

  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0)

  return { dailyOrders, revenue30, topProducts, totalRevenue }
}

export function generateInvoiceHTML(order, user) {
  const items = order.items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.price)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join("")

  return `<!DOCTYPE html><html><head><title>Invoice ${order.id}</title>
  <style>body{font-family:sans-serif;color:#333;max-width:700px;margin:40px auto;padding:20px}
  h1{color:#E53935}table{width:100%;border-collapse:collapse}th{background:#f5f5f5;padding:10px 12px;text-align:left}
  .total{font-size:1.1em;font-weight:bold}</style></head><body>
  <h1>FoodHub Invoice</h1>
  <p><strong>Order ID:</strong> ${order.id}</p>
  <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
  <p><strong>Customer:</strong> ${order.billing.name} (${order.billing.email})</p>
  <p><strong>Address:</strong> ${order.billing.street}, ${order.billing.city}, ${order.billing.state} ${order.billing.zip}</p>
  <hr/>
  <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
  <tbody>${items}</tbody></table>
  <hr/>
  <p>Subtotal: ${formatPrice(order.subtotal)}</p>
  ${order.discount > 0 ? `<p>Discount: -${formatPrice(order.discount)}</p>` : ""}
  <p>Delivery: ${order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : "FREE"}</p>
  <p class="total">Total: ${formatPrice(order.total)}</p>
  <hr/><p style="color:#999;font-size:0.85em">Thank you for ordering from FoodHub!</p>
  </body></html>`
}
