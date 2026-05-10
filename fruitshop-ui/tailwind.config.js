/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2fcf1',
          100: '#e1f9df',
          200: '#c5f2c2',
          300: '#99e695',
          400: '#65d160',
          500: '#3eb63a',
          600: '#2e962a',
          700: '#277624',
          800: '#235e21',
          900: '#1f4e1e',
          950: '#0c2b0c',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [],
}
