/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lighten: 'rgba(255, 255, 255, .05)',
        darken: 'rgba(0, 0, 0, .05)',
      },
    },
  },
  plugins: [],
}
