/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primaryPink: "#d53b84",
        dangerRed: "#fa546b",
        accentOrange: "#c14020",
        highlightOrange: "#f1633d",
      },
    },
  },
  plugins: [],
};
