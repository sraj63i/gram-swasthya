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
          50: '#e6f4f0',
          100: '#cce9e1',
          500: '#0b6e55',
          600: '#0a5a47',
          700: '#084738',
        },
        surface: '#ffffff',
        canvas: '#f3f6f5',
      },
    },
  },
  plugins: [],
}