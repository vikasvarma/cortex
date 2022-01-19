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
                theme1: "#ACB5AD",
                theme2: "#BED2C0",
                theme3: "#D7E4CF",
                theme4: "#6D8971",
                theme5: "#4E7B5D",
                theme6: "#2C4838",
                theme7: "#081918",
                card: "#e7f0f2"
            },
            backgroundImage: theme => ({
                'logo': "url('/src/client/assets/logo.png')"
            }),
            fontFamily: {
                'mulish': ['mulish', 'sans-serif'],
                'quicksand': ['quicksand', 'sans-serif'],
                'barlow': ['barlow', 'sans-serif'],
                'cairo': ['cairo', 'sans-serif'],
                'opensans': ['"Open Sans"', 'sans-serif'],
                'inter': ['"Inter var"'],
                'system': ['system-ui'],
                'elegant': ["Source Serif Pro"],
                'fjalla': ['Fjalla One'],
                'oswald': ['Oswald'],
                'roboto': ['Roboto'],
                'poppins': ['Poppins'],
                'playfair': ['Playfair Display'],
            },
            gridTemplateColumns: {
                'auto': 'auto auto auto auto',
                'sidebar': '40px 48px auto auto 80px',
            },
            letterSpacing: {
                wide: '.018em'
            }
        }
    },
    variants: {
        extend: {
            backgroundColor: ['active'],
            backgroundImage: ['hover', 'active'],
            opacity: ['disabled'],
            fontWeight: ['hover', 'focus', 'active'],
            animation: ['hover', 'focus'],
            ringWidth: ['hover', 'focus'],
            ringColor: ['hover', 'active'],
            ringOpacity: ['hover', 'active'],
            cursor: ['hover', 'active'],
        },
    },
    plugins: [
        // ...
        require("@tailwindcss/line-clamp")
    ],
}
