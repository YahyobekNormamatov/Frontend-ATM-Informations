/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#f3e8f7',
          100: '#e8d0f0',
          200: '#d0a1e0',
          300: '#b872d1',
          400: '#a043c1',
          500: '#8E24AA',
          600: '#7C4DFF',
          700: '#6a1b8a',
          800: '#57146e',
          900: '#430d53',
          
        },
        teal: {
          50: '#e6faf8',
          100: '#ccf5f0',
          200: '#99ebe0',
          300: '#66e0d1',
          400: '#33d6c1',
          500: '#00BFA5',
          600: '#10B981',
          700: '#00897b',
          800: '#00665c',
          900: '#00443e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}