/** @type {import('tailwindcss').Config} */
module.exports = {
  content:[
  "./src/**/*.{js,jsx,ts,tsx}",
],
  theme: {
    extend: {
      colors: {
        pup: {
          maroon: "#800000",
          goldLight: "#FFDF00",
          goldDark: "#DAA520",
          white: "#FFFFFF",
        }
      }
    },
  },
  plugins: [],
}

