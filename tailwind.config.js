module.exports = {
  purge: {
    content: ['./resources/**/*.tsx']
  },
  theme: {
    fontFamily: {
      sans: ['Quicksand', '"Segoe UI"',  '"Helvetica Neue"', 'Arial', 'sans-serif']
    },
    extend: {
      height: {
        '10vh': '10vh',
        '15vh': '15vh',
        '85vh': '85vh',
        '90vh': '90vh'
      }
    }
  },
  plugins: []
}
