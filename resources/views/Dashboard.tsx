import React, { useState, useEffect, useRef, RefObject } from 'react'
import { Navigation } from '../components/Navigation'

export default function Landing () {
  return (
    <div className='stack'>
      <Navigation />
      <div className='w-full h-16 sm:hidden' />
    </div>
  )
}
