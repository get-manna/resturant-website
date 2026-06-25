/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#FFEBEE",
          100: "#FFCDD2",
          200: "#EF9A9A",
          300: "#E57373",
          400: "#EF5350",
          500: "#E53935",
          600: "#E53935",
          700: "#C62828",
          800: "#B71C1C",
          900: "#7F0000",
        },
        dark: {
          bg:      "#111827",
          surface: "#1F2937",
          border:  "#374151",
          text:    "#F9FAFB",
          muted:   "#9CA3AF",
        },
      },
      fontFamily: {
        sans:    ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "ui-sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(229, 57, 53, 0.08)",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease-in-out",
        "slide-up":   "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: {
          "0%":   { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)",    opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
