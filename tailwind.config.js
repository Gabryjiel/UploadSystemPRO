module.exports = {
  darkMode: 'class',
  purge: {
    content: ['./resources/**/*.tsx']
  },
  theme: {
    fontFamily: {
      sans: ['Quicksand', '"Segoe UI"',  '"Helvetica Neue"', 'Arial', 'sans-serif']
    },
    extend: {
      spacing: {
        '100': '28rem',
        '104': '32rem',
        '108': '36rem'
      },
      boxShadow: {
        white: '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06);',
      },
      minHeight: {
        '10': '10vh', '15': '15vh', '20': '20vh', '30': '30vh', '40': '40vh', '50': '50vh', '60': '60vh', '70': '70vh', '80': '80vh', '85': '85vh', '90': '90vh'
      }
    }
  },
  variants: {
    extend: {
      display: ['dark'],
      boxShadow: ['dark'],
      fontWeight: ['dark']
    }
  },
  plugins: []
}
