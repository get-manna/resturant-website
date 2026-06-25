import { createContext, useContext, useCallback } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage.js"
import { INITIAL_ORDERS } from "@/data/orders.js"
import { generateOrderId } from "@/utils/orderHelpers.js"

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const [orders, setOrders] = useLocalStorage("foodhub_orders", INITIAL_ORDERS)

  const placeOrder = useCallback((orderData) => {
    const newOrder = {
      ...orderData,
      id: generateOrderId(),
      status: "Pending",
      statusHistory: [{ status: "Pending", timestamp: new Date().toISOString(), note: "Order placed" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }, [setOrders])

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      return {
        ...o,
        status: newStatus,
        statusHistory: [
          ...o.statusHistory,
          { status: newStatus, timestamp: new Date().toISOString(), note: `Status updated to ${newStatus}` },
        ],
        updatedAt: new Date().toISOString(),
      }
    }))
  }, [setOrders])

  const getOrderById = useCallback((id) => orders.find(o => o.id === id), [orders])

  const getUserOrders = useCallback((userId) =>
    orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  )

  const getAllOrders = useCallback(() =>
    [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  )

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus, getOrderById, getUserOrders, getAllOrders }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error("useOrders must be used within OrderProvider")
  return ctx
}
