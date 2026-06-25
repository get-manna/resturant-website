export const CATEGORIES = [
  { id: "burgers",    name: "Burgers",    slug: "burgers",    icon: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",  productCount: 8, isActive: true },
  { id: "pizza",      name: "Pizza",      slug: "pizza",      icon: "🍕", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80",  productCount: 7, isActive: true },
  { id: "sushi",      name: "Sushi",      slug: "sushi",      icon: "🍣", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",  productCount: 6, isActive: true },
  { id: "pasta",      name: "Pasta",      slug: "pasta",      icon: "🍝", image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&q=80",  productCount: 5, isActive: true },
  { id: "salads",     name: "Salads",     slug: "salads",     icon: "🥗", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",  productCount: 4, isActive: true },
  { id: "drinks",     name: "Drinks",     slug: "drinks",     icon: "🥤", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",     productCount: 6, isActive: true },
  { id: "desserts",   name: "Desserts",   slug: "desserts",   icon: "🍰", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",     productCount: 5, isActive: true },
  { id: "sandwiches", name: "Sandwiches", slug: "sandwiches", icon: "🥪", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",  productCount: 5, isActive: true },
]

export function getCategories() {
  try { return JSON.parse(localStorage.getItem("foodhub_categories") || "null") || CATEGORIES }
  catch { return CATEGORIES }
}
