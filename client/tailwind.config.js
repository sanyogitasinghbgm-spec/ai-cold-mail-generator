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
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        cosmic: {
          bg: '#080816',
          card: 'rgba(17, 17, 35, 0.45)',
          border: 'rgba(255, 255, 255, 0.06)',
          text: '#F3F4F6',
          muted: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px 0px rgba(139, 92, 246, 0.25)',
        'glow-secondary': '0 0 25px 0px rgba(236, 72, 153, 0.2)',
      }
    },
  },
  plugins: [],
}
