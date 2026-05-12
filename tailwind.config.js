/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        espresso: "#0F0A06",
        "card-bg": "#1A1208",
        "card-elevated": "#2D1E10",
        gold: "#C9A96E",
        "gold-light": "#E8D4A8",
        "gold-dim": "#6B5430",
        success: "#2D6A4F",
        "success-light": "#95D5B2",
        warning: "#92600A",
        "warning-light": "#FFD166",
        danger: "#7F1D1D",
        "danger-light": "#FCA5A5"
      },
      fontFamily: {
        tajawal: ["Tajawal", "system-ui", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      boxShadow: {
        gold: "0 18px 70px rgba(201, 169, 110, 0.08)",
        insetTop: "inset 0 1px 0 rgba(232, 212, 168, 0.18)"
      }
    }
  },
  plugins: []
};
