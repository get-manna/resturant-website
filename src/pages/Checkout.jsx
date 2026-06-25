import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiShoppingCart, FiMapPin, FiCreditCard, FiCheck, FiTag, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi"
import { useCart } from "@/context/CartContext.jsx"
import { useAuth } from "@/context/AuthContext.jsx"
import { useOrders } from "@/context/OrderContext.jsx"
import { formatPrice } from "@/utils/formatCurrency.js"
import { validateBillingForm } from "@/utils/validateForm.js"
import { Link, useNavigate } from "react-router-dom"
import Button from "@/components/common/Button.jsx"
import toast from "react-hot-toast"

const STEPS = [
  { id: 1, label: "Cart",     icon: FiShoppingCart },
  { id: 2, label: "Billing",  icon: FiMapPin },
  { id: 3, label: "Payment",  icon: FiCreditCard },
  { id: 4, label: "Done",     icon: FiCheck },
]

export default function Checkout() {
  const { items, subtotal, deliveryFee, total, couponCode, couponDiscount, updateQty, removeItem, applyCoupon, removeCoupon, clearCart } = useCart()
  const { user } = useAuth()
  const { placeOrder } = useOrders()
  const navigate = useNavigate()
  const orderRef = useRef(null)

  const [step, setStep] = useState(1)
  const [couponInput, setCouponInput] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [billing, setBilling] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "",
    deliveryType: "delivery",
    street: user?.address?.street || "", city: user?.address?.city || "",
    state: user?.address?.state || "", zip: user?.address?.zip || "", country: user?.address?.country || "USA",
  })
  const [billingErrors, setBillingErrors] = useState({})
  const [payment, setPayment] = useState({ method: "card", cardNumber: "", cardName: "", expiry: "", cvv: "" })
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)

  const handleCoupon = () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      applyCoupon(couponInput)
      toast.success("Coupon applied!")
    } catch (err) {
      toast.error(err.message)
    }
    setCouponLoading(false)
  }

  const handleBillingNext = () => {
    const errs = validateBillingForm(billing)
    if (Object.keys(errs).length > 0) { setBillingErrors(errs); return }
    setStep(3)
  }

  const handlePayment = async () => {
    setPaymentLoading(true)
    await new Promise(r => setTimeout(r, 1500))

    if (orderRef.current) { setPaymentLoading(false); return }

    const orderData = {
      userId: user.id,
      items: items.map(i => ({ ...i })),
      subtotal,
      discount: couponDiscount,
      deliveryFee,
      total,
      couponCode: couponCode || null,
      billing: { ...billing },
      payment: { method: payment.method, ...(payment.method === "card" ? { last4: payment.cardNumber.slice(-4) || "****" } : {}) },
      deliveryType: billing.deliveryType,
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
      notes: "",
    }
    const order = placeOrder(orderData)
    orderRef.current = order
    clearCart()
    setCompletedOrder(order)
    setPaymentLoading(false)
    setStep(4)
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            s.id === step ? "bg-primary-500 text-white shadow-md" :
            s.id < step  ? "bg-green-500 text-white" :
                           "bg-gray-100 dark:bg-dark-surface text-gray-500 dark:text-dark-muted"
          }`}>
            <s.icon size={15} /> <span className="hidden sm:inline">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-6 sm:w-12 mx-1 transition-colors ${s.id < step ? "bg-green-400" : "bg-gray-200 dark:bg-dark-border"}`} />
          )}
        </div>
      ))}
    </div>
  )

  if (items.length === 0 && step < 4) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text mb-3">Your cart is empty</h2>
          <Link to="/products" className="btn-primary mt-4 inline-block">Browse Menu</Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-extrabold text-gray-900 dark:text-dark-text text-center mb-4">Checkout</h1>
        <StepIndicator />

        <AnimatePresence mode="wait">
          {/* STEP 1: Cart Review */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {items.map(item => (
                    <div key={item.productId} className="card p-4 flex gap-4">
                      <img src={item.thumbnail} alt={item.name} className="h-20 w-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-dark-text">{item.name}</p>
                        <p className="text-primary-500 font-bold mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 border border-gray-200 dark:border-dark-border rounded-xl p-0.5">
                            <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="h-7 w-7 rounded-lg bg-gray-50 dark:bg-dark-bg flex items-center justify-center hover:text-primary-500"><FiMinus size={12} /></button>
                            <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-dark-text">{item.quantity}</span>
                            <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="h-7 w-7 rounded-lg bg-gray-50 dark:bg-dark-bg flex items-center justify-center hover:text-primary-500"><FiPlus size={12} /></button>
                          </div>
                          <button onClick={() => removeItem(item.productId)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 size={14} /></button>
                          <span className="ml-auto font-bold text-gray-800 dark:text-dark-text">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card p-5 space-y-4 h-fit">
                  {/* Coupon */}
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                      <span className="text-sm text-green-700 dark:text-green-400 font-semibold">✓ {couponCode} applied</span>
                      <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Coupon code" className="input-field pl-9 text-sm py-2" />
                      </div>
                      <Button variant="outline" size="sm" loading={couponLoading} onClick={handleCoupon}>Apply</Button>
                    </div>
                  )}
                  <hr className="border-gray-100 dark:border-dark-border" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                    {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(couponDiscount)}</span></div>}
                    <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Delivery</span><span>{deliveryFee > 0 ? formatPrice(deliveryFee) : <span className="text-green-600">FREE</span>}</span></div>
                    <div className="flex justify-between font-bold text-gray-900 dark:text-dark-text text-base pt-2 border-t border-gray-100 dark:border-dark-border"><span>Total</span><span className="text-primary-500">{formatPrice(total)}</span></div>
                  </div>
                  <Button className="w-full" onClick={() => setStep(2)}>Continue to Billing</Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Billing */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="card p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-dark-text mb-6">Billing & Delivery</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "name",  label: "Full Name",    type: "text",  placeholder: "Jane Smith" },
                    { key: "email", label: "Email",        type: "email", placeholder: "you@example.com" },
                    { key: "phone", label: "Phone",        type: "tel",   placeholder: "+1 (555) 000-0000" },
                  ].map(f => (
                    <div key={f.key} className={f.key === "name" ? "sm:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
                      <input type={f.type} value={billing[f.key]} onChange={e => setBilling(b => ({ ...b, [f.key]: e.target.value }))}
                        placeholder={f.placeholder} className={`input-field ${billingErrors[f.key] ? "border-red-400" : ""}`} />
                      {billingErrors[f.key] && <p className="text-xs text-red-500 mt-1">{billingErrors[f.key]}</p>}
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Delivery Type</label>
                    <div className="flex gap-3">
                      {["delivery", "pickup"].map(type => (
                        <button key={type} type="button" onClick={() => setBilling(b => ({ ...b, deliveryType: type }))}
                          className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-colors ${billing.deliveryType === type ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400"}`}>
                          {type === "delivery" ? "🚚 " : "🏪 "}{type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {billing.deliveryType === "delivery" && (
                    <>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address</label>
                        <input value={billing.street} onChange={e => setBilling(b => ({ ...b, street: e.target.value }))}
                          placeholder="123 Main Street" className={`input-field ${billingErrors.street ? "border-red-400" : ""}`} />
                        {billingErrors.street && <p className="text-xs text-red-500 mt-1">{billingErrors.street}</p>}
                      </div>
                      {[["city","City","Brooklyn"], ["state","State","NY"], ["zip","ZIP Code","11201"], ["country","Country","USA"]].map(([key, label, ph]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                          <input value={billing[key]} onChange={e => setBilling(b => ({ ...b, [key]: e.target.value }))}
                            placeholder={ph} className={`input-field ${billingErrors[key] ? "border-red-400" : ""}`} />
                          {billingErrors[key] && <p className="text-xs text-red-500 mt-1">{billingErrors[key]}</p>}
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1" onClick={handleBillingNext}>Continue to Payment</Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="card p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-dark-text mb-6">Payment</h2>
                <div className="space-y-3 mb-6">
                  {[
                    { method: "card",   label: "💳 Credit / Debit Card" },
                    { method: "cash",   label: "💵 Cash on Delivery" },
                    { method: "wallet", label: "🔐 Digital Wallet" },
                  ].map(opt => (
                    <label key={opt.method} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${payment.method === opt.method ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-dark-border"}`}>
                      <input type="radio" name="payment" value={opt.method} checked={payment.method === opt.method} onChange={() => setPayment(p => ({ ...p, method: opt.method }))} className="accent-primary-500" />
                      <span className="font-medium text-gray-800 dark:text-dark-text">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {payment.method === "card" && (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Card Number</label>
                      <input value={payment.cardNumber} onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16) }))}
                        placeholder="1234 5678 9012 3456" className="input-field" maxLength={16} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expiry</label>
                      <input value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} placeholder="MM/YY" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">CVV</label>
                      <input value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="123" className="input-field" maxLength={4} />
                    </div>
                  </div>
                )}

                <div className="flex justify-between font-bold text-gray-900 dark:text-dark-text text-lg mb-6 p-4 bg-gray-50 dark:bg-dark-surface rounded-xl">
                  <span>Total Due</span>
                  <span className="text-primary-500">{formatPrice(total)}</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-1" loading={paymentLoading} onClick={handlePayment}>
                    Place Order {formatPrice(total)}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && completedOrder && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg mx-auto">
              <div className="card p-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6 text-4xl">
                  ✅
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text mb-2">Order Confirmed!</h2>
                <p className="text-gray-500 dark:text-dark-muted mb-6">Your order has been placed successfully.</p>

                <div className="bg-gray-50 dark:bg-dark-surface rounded-xl p-4 text-left space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-bold text-primary-500">{completedOrder.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold text-gray-900 dark:text-dark-text">{formatPrice(completedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estimated</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">~30 minutes</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link to={`/dashboard/orders/${completedOrder.id}/track`} className="btn-primary py-3 inline-block">
                    Track My Order
                  </Link>
                  <Link to="/products" className="btn-outline py-3 inline-block">Continue Shopping</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
