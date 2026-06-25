import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft, FiZap } from "react-icons/fi"
import { getProducts } from "@/data/products.js"
import { getCategories } from "@/data/categories.js"
import { useCart } from "@/context/CartContext.jsx"
import { useAuth } from "@/context/AuthContext.jsx"
import { formatPrice } from "@/utils/formatCurrency.js"
import { formatDate } from "@/utils/formatDate.js"
import StarRating from "@/components/common/StarRating.jsx"
import ProductCard from "@/components/products/ProductCard.jsx"
import toast from "react-hot-toast"

const INITIAL_REVIEWS = [
  { id: "r1", productId: "p1", userId: "u2", userName: "Jane S.", rating: 5, comment: "Absolutely amazing! Best smash burger I have ever had. Will order again.", createdAt: "2024-02-15T10:00:00Z" },
  { id: "r2", productId: "p1", userId: "u3", userName: "John D.", rating: 4, comment: "Really good, came hot and fresh. Slightly overdone but still delicious.", createdAt: "2024-02-18T12:00:00Z" },
  { id: "r3", productId: "p5", userId: "u2", userName: "Jane S.", rating: 5, comment: "Classic Italian perfection. Thin crust, fresh mozzarella, authentic taste.", createdAt: "2024-02-10T09:00:00Z" },
  { id: "r4", productId: "p8", userId: "u3", userName: "John D.", rating: 5, comment: "Freshest sushi outside of Japan. Incredible quality for delivery.", createdAt: "2024-02-12T14:00:00Z" },
  { id: "r5", productId: "p18", userId: "u2", userName: "Jane S.", rating: 5, comment: "The lava cake is literally the best dessert I have ever ordered. Heaven.", createdAt: "2024-02-20T18:00:00Z" },
]

export default function SingleProduct() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const allProducts = getProducts()
  const product = allProducts.find(p => p.slug === slug)
  const allCategories = getCategories()
  const catObj = product ? allCategories.find(c => c.id === product.category || c.slug === product.category) : null
  const categoryName = catObj?.name ?? product?.category ?? ""
  const categorySlug = catObj?.slug ?? product?.category ?? ""
  const { addItem, toggleCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🍽️</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2">Product not found</h2>
          <Link to="/products" className="btn-primary mt-4 inline-block">Back to Menu</Link>
        </div>
      </div>
    )
  }

  const finalPrice = product.discountPrice ?? product.price
  const productReviews = reviews.filter(r => r.productId === product.id)
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`${product.name} added to cart!`)
    toggleCart()
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    navigate("/checkout")
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!newReview.comment.trim()) return toast.error("Please write a review comment")
    const r = {
      id: `r${Date.now()}`,
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString(),
    }
    setReviews(prev => [r, ...prev])
    setNewReview({ rating: 5, comment: "" })
    toast.success("Review submitted!")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-muted mb-8">
          <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-500 transition-colors">Menu</Link>
          <span>/</span>
          <Link to={`/products?category=${categorySlug}`} className="hover:text-primary-500 capitalize transition-colors">{categoryName}</Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-dark-text truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div className="space-y-4">
            <motion.div layoutId={`product-${product.id}`} className="aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-dark-surface">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary-500" : "border-gray-200 dark:border-dark-border"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-primary-500 font-medium capitalize text-sm mb-2">{categoryName}</p>
            <h1 className="text-3xl font-display font-extrabold text-gray-900 dark:text-dark-text mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <StarRating rating={product.rating} showCount count={product.reviewCount} />
              {product.isAvailable ? (
                <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">In Stock</span>
              ) : (
                <span className="badge bg-red-100 text-red-700">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-display font-extrabold text-primary-500">{formatPrice(finalPrice)}</span>
              {product.discountPrice && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
              {product.discountPrice && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{product.description}</p>

            {/* Ingredients */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map(ing => (
                  <span key={ing} className="badge bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300">{ing}</span>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity</span>
              <div className="flex items-center gap-2 border border-gray-200 dark:border-dark-border rounded-xl p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-dark-bg flex items-center justify-center hover:bg-primary-50 hover:text-primary-500 transition-colors">
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-gray-900 dark:text-dark-text">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-dark-bg flex items-center justify-center hover:bg-primary-50 hover:text-primary-500 transition-colors">
                  <FiPlus size={14} />
                </button>
              </div>
              <span className="text-sm text-gray-400">{product.stock} available</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button onClick={handleAddToCart} disabled={!product.isAvailable}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-colors">
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={!product.isAvailable}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900 font-bold py-3.5 px-6 rounded-xl transition-colors">
                <FiZap size={18} /> Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-dark-border">
            {["description", "reviews"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 capitalize font-semibold text-sm transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? "border-primary-500 text-primary-500" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab} {tab === "reviews" && `(${productReviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === "description" ? (
            <div className="max-w-3xl">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base mb-4">{product.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="badge bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 capitalize">#{tag}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl space-y-6">
              {isAuthenticated && (
                <form onSubmit={handleSubmitReview} className="card p-6 space-y-4">
                  <h3 className="font-display font-bold text-gray-900 dark:text-dark-text">Write a Review</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button type="button" key={s} onClick={() => setNewReview(r => ({ ...r, rating: s }))}
                          className={`text-2xl transition-transform hover:scale-125 ${s <= newReview.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={newReview.comment} onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                    placeholder="Share your experience…" rows={3} className="input-field resize-none" />
                  <button type="submit" className="btn-primary py-2.5 px-6">Submit Review</button>
                </form>
              )}

              {productReviews.length === 0 ? (
                <p className="text-gray-500 dark:text-dark-muted">No reviews yet. Be the first!</p>
              ) : (
                productReviews.map(r => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-dark-text">{r.userName}</p>
                        <StarRating rating={r.rating} size={13} />
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-2">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
