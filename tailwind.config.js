/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        accent: {
          DEFAULT: "#0d9488",
          light: "#2dd4bf",
          dark: "#0f766e",
        },
      },
      boxShadow: {
        soft: "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
        glow: "0 0 40px -10px rgba(13, 148, 136, 0.45)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(at 40% 20%, rgba(45, 212, 191, 0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(99, 102, 241, 0.2) 0px, transparent 45%), radial-gradient(at 0% 50%, rgba(13, 148, 136, 0.15) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
