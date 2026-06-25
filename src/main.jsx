import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import "./index.css"
import App from "./App.jsx"
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import { OrderProvider } from "./context/OrderContext.jsx"
import { CartProvider } from "./context/CartContext.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <BrowserRouter>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: "12px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                  },
                  success: { iconTheme: { primary: "#E53935", secondary: "#fff" } },
                }}
              />
            </BrowserRouter>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
