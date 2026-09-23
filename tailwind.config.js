/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["Cairo", "Tajawal", "sans-serif"],
      },
      colors: {
        soroban: {
          purple: "#6D28D9",
          gold: "#FBBF24",
          dark: "#1E1B4B",
        },
      },
    },
  },
  plugins: [],
};