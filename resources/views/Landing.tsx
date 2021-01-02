import React, { useState, useEffect, useRef, RefObject } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import iconDarkMode from '../assets/images/icon-darkmode.svg'
import iconLightMode from '../assets/images/icon-lightmode.svg'

export const Landing = () => {
  const { pathname } = useLocation()
  const [darkTheme, setDarkTheme] = useState<boolean>(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const logInRef = useRef<HTMLDivElement>(null)
  const signUpRef = useRef<HTMLDivElement>(null)

  const toggleTheme = () => setDarkTheme(() => !darkTheme)

  const scrollTo = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollTo(pathname === '/login' ? logInRef : pathname === '/signup' ? signUpRef : headerRef)
  }, [])


  return (
    <div className="stack">
      <header className="hstack justify-between px-5 h-15vh sm:h-10vh" ref={headerRef}>
        <div className="hstack items-center space-x-2 text-lg md:text-2xl">
          <img src={logo} width="32px" height="32px" />
          <div className="stack font-bold text-center sm:flex-row sm:space-x-2">
            <h1>Upload System</h1>
            <h1>PRO</h1>
          </div>
        </div>
        <div className="hstack items-center text-lg space-x-5 md:space-x-8">
          <Link to='/login' className="cursor-pointer" onClick={() => scrollTo(logInRef)}>Log In</Link>
          <Link to='/signup' className="cursor-pointer" onClick={() => scrollTo(signUpRef)}>Sign Up</Link>
          <img
            className="cursor-pointer" height="32px" width="32px"
            src={darkTheme ? iconDarkMode : iconLightMode} onClick={toggleTheme}
          />
        </div>
      </header>

      <main>
        <section className="landing-tile h-85vh sm:h-90vh bg-purple-100">
          <p className='text-4xl sm:text-6xl'>Upload System PRO</p>
          <p className='text-2xl sm:text-4xl mt-2 animate-type'>chores simplified </p>
          <Link to='/login' className="cursor-pointer bg-black rounded text-white text-xl sm:text-2xl px-4 py-2 mt-4 sm:mt-8" onClick={() => scrollTo(logInRef)}>Log In</Link>
        </section>

        <section className="landing-tile bg-gray-400" ref={logInRef}>
        </section>

        <section className="landing-tile bg-blue-400" ref={signUpRef}>
        </section>
      </main>

      <footer className="flex justify-center bg-gray-600">
        <p className="p-40">FOOTER</p>
      </footer>
    </div>
  )
}
