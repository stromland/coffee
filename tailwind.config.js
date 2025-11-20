/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Coffee-themed color palette - Original
        'olive-dark': '#283618',    // Dark olive - backgrounds, dark text
        'olive': '#606c38',          // Olive green - primary actions, accents
        'cream': '#fefae0',          // Cream - light backgrounds, cards
        'caramel': '#dda15e',        // Caramel - secondary accents, highlights
        'coffee': '#bc6c25',         // Coffee brown - emphasis, warm accents

        // Extended palette for light mode
        'cream-light': '#fffef7',    // Lighter cream for light mode backgrounds
        'olive-light': '#8fa368',    // Lighter olive for light mode accents
        'coffee-light': '#d4873f',   // Lighter coffee for light mode emphasis

        // Semantic color system
        background: {
          primary: '#283618',        // Dark mode primary background
          secondary: '#1a1410',      // Dark mode secondary background
          tertiary: '#1f2914',       // Dark mode tertiary (for gradients)
          light: {
            primary: '#fffef7',      // Light mode primary background
            secondary: '#f5f5f0',    // Light mode secondary background
            tertiary: '#f8f7ef',     // Light mode tertiary (for gradients)
          }
        },
        surface: {
          DEFAULT: 'rgba(96, 108, 56, 0.2)',    // Dark mode card surface
          hover: 'rgba(96, 108, 56, 0.3)',      // Dark mode hover
          light: {
            DEFAULT: 'rgba(255, 255, 255, 0.8)', // Light mode card surface
            hover: 'rgba(255, 255, 255, 0.9)',   // Light mode hover
          }
        },
        text: {
          primary: '#fefae0',        // Dark mode primary text
          secondary: '#dda15e',      // Dark mode secondary text
          light: {
            primary: '#283618',      // Light mode primary text
            secondary: '#606c38',    // Light mode secondary text
          }
        },
        accent: {
          primary: '#bc6c25',        // Primary accent (works in both modes)
          secondary: '#dda15e',      // Secondary accent
        }
      },
      boxShadow: {
        // Modern elevation system - Dark mode
        'depth-1': '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'depth-2': '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
        'depth-3': '0 8px 16px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)',
        'depth-4': '0 12px 24px rgba(0,0,0,0.18), 0 6px 12px rgba(0,0,0,0.12)',
        'depth-5': '0 20px 40px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.15)',

        // Light mode variants with softer, olive-tinted shadows
        'depth-1-light': '0 2px 4px rgba(40,54,24,0.08), 0 1px 2px rgba(40,54,24,0.04)',
        'depth-2-light': '0 4px 8px rgba(40,54,24,0.1), 0 2px 4px rgba(40,54,24,0.06)',
        'depth-3-light': '0 8px 16px rgba(40,54,24,0.12), 0 4px 8px rgba(40,54,24,0.08)',
        'depth-4-light': '0 12px 24px rgba(40,54,24,0.14), 0 6px 12px rgba(40,54,24,0.1)',
        'depth-5-light': '0 20px 40px rgba(40,54,24,0.16), 0 10px 20px rgba(40,54,24,0.12)',

        // Glow effects
        'glow-coffee': '0 0 8px rgba(188,108,37,0.5)',
        'glow-coffee-lg': '0 0 16px rgba(188,108,37,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '200% 0' },
          '50%': { backgroundPosition: '-200% 0' },
        }
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      backdropSaturate: {
        '150': '1.5',
        '200': '2',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}

