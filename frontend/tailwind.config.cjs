/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '3xl': '3rem',
      },
      colors: {
        indigo: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dce4fd',
          300: '#c2cffa',
          400: '#9fb0f7',
          500: '#758af2',
          600: '#5064e9',
          700: '#3d4ed6',
          800: '#3541ad',
          900: '#2f3b89',
          950: '#1c2251',
        },
      },
    },
  },
  plugins: [],
}
