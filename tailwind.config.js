/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'Cabinet Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c0d2ff",
          300: "#93b4fd",
          400: "#6090fa",
          500: "#3d6ef6",
          600: "#2550eb",
          700: "#1d3fd8",
          800: "#1e35af",
          900: "#1e318a",
          950: "#161f57",
        },
        surface: {
          50:  "#f8f9fc",
          100: "#f0f2f8",
          200: "#e2e6f0",
          800: "#1a1d2e",
          850: "#141624",
          900: "#0e1018",
          950: "#080a10",
        },
      },
      animation: {
        "fade-in":     "fadeIn 0.4s ease forwards",
        "slide-up":    "slideUp 0.4s ease forwards",
        "slide-right": "slideRight 0.3s ease forwards",
        "pulse-slow":  "pulse 3s ease-in-out infinite",
        "bounce-in":   "bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "shimmer":     "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                      to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        slideRight:{ from: { opacity: 0, transform: "translateX(-20px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        bounceIn:  { from: { opacity: 0, transform: "scale(0.8)" }, to: { opacity: 1, transform: "scale(1)" } },
        shimmer:   { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
      boxShadow: {
        "card":    "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
        "card-lg": "0 4px 6px rgba(0,0,0,0.04), 0 20px 48px rgba(0,0,0,0.10)",
        "brand":   "0 8px 24px rgba(61,110,246,0.35)",
        "glow":    "0 0 40px rgba(61,110,246,0.2)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #3d6ef6 0%, #6090fa 100%)",
        "gradient-dark":  "linear-gradient(135deg, #0e1018 0%, #1a1d2e 100%)",
        "mesh":           "radial-gradient(at 40% 20%, hsla(228,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
}
