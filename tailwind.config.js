/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coffee-themed color palette
        'olive-dark': '#283618',    // Dark olive - backgrounds, dark text
        'olive': '#606c38',          // Olive green - primary actions, accents
        'cream': '#fefae0',          // Cream - light backgrounds, cards
        'caramel': '#dda15e',        // Caramel - secondary accents, highlights
        'coffee': '#bc6c25',         // Coffee brown - emphasis, warm accents
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

