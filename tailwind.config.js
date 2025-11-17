/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{index,App,types,constants}.{ts,tsx}",
    "./{assets,components,hooks,services}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define the custom fonts
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}