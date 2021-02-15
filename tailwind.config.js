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
        white: '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)',
      },
      minHeight: {
        '10': '10vh', '15': '15vh', '20': '20vh', '30': '30vh', '40': '40vh', '50': '50vh', '60': '60vh', '70': '70vh', '80': '80vh', '85': '85vh', '90': '90vh'
      },
      borderWidth: {
        '1': '1px'
      },
      gridTemplateColumns: {
        'subjects': 'min-content 3fr 1fr 1fr',
        'assignments': 'min-content 6fr 2fr 2fr 1fr',
        'answers': 'min-content 3fr 2fr 2fr min-content'
      },
      animation: {
        'type': 'type .5s alternate infinite'
      },
      keyframes: {
        type: {
          'from': { 'box-shadow': 'inset -2px 0px 0px currentColor' },
          'to': { 'box-shadow': 'inset -2px 0px 0px transparent' }
        }
      },
      screens: {
        'kb': {'raw': '(orientation: portrait) and (max-height: 640px)'}
      }
    }
  },
  variants: {
    extend: {
      display: ['dark'],
      boxShadow: ['dark'],
      fontWeight: ['dark'],
      opacity: ['disabled'],
      cursor: ['disabled'],
      textColor: ['disabled'],
      pointerEvents: ['disabled'],
      backgroundColor: ['disabled']
    }
  }
}
