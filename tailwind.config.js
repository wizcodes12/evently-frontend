/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0e7ff',
          100: '#d9c3ff',
          200: '#c19eff',
          300: '#a879ff',
          400: '#9054ff',
          500: '#7828ff',
          600: '#6420e6',
          700: '#5018cc',
          800: '#3d10b3',
          900: '#2a0899',
        },
        secondary: {
          50: '#e6f1ff',
          100: '#b3d7ff',
          200: '#80bdff',
          300: '#4da3ff',
          400: '#1a89ff',
          500: '#006fe6',
          600: '#0056b3',
          700: '#003d80',
          800: '#00244d',
          900: '#000b1a',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7828ff 0%, #1a89ff 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #6420e6 0%, #006fe6 100%)',
      },
    },
  },
  plugins: [],
}
