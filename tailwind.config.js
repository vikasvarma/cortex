const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        rose: colors.rose,
        teal: colors.teal,
        orange: colors.orange,
        header: "#1f1f1f",
        navbar: "#fafafa",
        hover: "rgb(216, 237, 223)",
        selected: "rgb(155, 196, 169)",
        theme: "#146264",
        card: "#e7f0f2"
      },
      backgroundImage: theme => ({
        'logo': "url('/src/assets/logo.png')"
      }),
      fontFamily: {
        'mulish': ['mulish', 'sans-serif'],
        'quicksand': ['quicksand', 'sans-serif'],
        'barlow': ['barlow', 'sans-serif'],
        'cairo': ['cairo', 'sans-serif'],
        'opensans': ['"Open Sans"', 'sans-serif'],
        'inter': ['"Inter var"']
      },
      gridTemplateColumns: {
        'auto': 'auto auto auto auto',
        'sidebar': '40px 48px auto auto 80px',
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      backgroundImage: ['hover','active'],
      opacity: ['disabled'],
      fontWeight: ['hover','focus','active'],
      animation: ['hover', 'focus'],
      ringWidth: ['hover', 'focus'],
      ringColor: ['hover', 'active'],
      ringOpacity: ['hover', 'active'],
      cursor: ['hover', 'active'],
    },
  },
  plugins: [],
}
