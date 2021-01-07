module.exports = {
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
      }
    }
  },
  plugins: []
}
