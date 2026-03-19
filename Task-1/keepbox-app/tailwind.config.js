/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#135bec',
        'bg-light': '#f6f6f8',
        'bg-dark': '#101622',
        surface: '#ffffff',
        'surface-dark': '#1e293b',
        'border-default': '#f1f5f9',
        'border-dark': '#1e293b',
        'text-primary': '#0f172a',
        'text-secondary': '#94a3b8',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
