/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#eef4ff',
          blue: '#7ca3e8',
          dark: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}