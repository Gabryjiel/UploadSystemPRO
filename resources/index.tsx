import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'

if (localStorage.getItem('mode') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
}

const app = document.querySelector('.app')

ReactDOM.render(<App />, app)
