import React, { useState, useRef, RefObject } from 'react'
import logo from '../assets/images/logo.svg'
import iconDarkMode from '../assets/images/icon-darkmode.svg'
import iconLightMode from '../assets/images/icon-lightmode.svg'

export const Landing = () => {
  const [darkTheme, setDarkTheme] = useState<boolean>(false)

  const logInRef = useRef<HTMLDivElement>(null)
  const signUpRef = useRef<HTMLDivElement>(null)

  const toggleTheme = () => setDarkTheme(() => !darkTheme)

  const scrollTo = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col">
      <header className="flex flex-row justify-between px-5 h-15vh sm:h-10vh">
        <div className="flex flex-row items-center space-x-2 text-lg md:text-2xl">
          <img src={logo} width="32px" height="32px" />
          <div className="font-bold text-center flex flex-col sm:flex-row sm:space-x-2">
            <h1>Upload System</h1>
            <h1>PRO</h1>
          </div>
        </div>
        <div className="flex flex-row items-center text-lg space-x-5 md:space-x-8">
          <a className="cursor-pointer" onClick={() => scrollTo(logInRef)}>Log In</a>
          <a className="cursor-pointer" onClick={() => scrollTo(signUpRef)}>Sign Up</a>
          <img
            className="cursor-pointer" height="32px" width="32px"
            src={darkTheme ? iconDarkMode : iconLightMode} onClick={toggleTheme}
          />
        </div>
      </header>

      <main>
        <section className="flex h-85vh sm:h-90vh items-center justify-center bg-red-400">
          <div className="text-center">
            <p>SOME SIMPLISTIC BUT RATHER COOL LOOKING PICTURE</p>
            <p>WITH A HUGE "LOG IN" BUTTON IN THE MIDDLE</p>
          </div>
        </section>

        <section className="flex h-screen items-center justify-center bg-gray-400" ref={logInRef}>
          <p>LOG IN FORM</p>
        </section>

        <section className="flex h-screen items-center justify-center bg-blue-400" ref={signUpRef}>
          <p>SIGN UP FORM</p>
        </section>
      </main>

      <footer className="flex justify-center bg-gray-600">
        <p className="p-40">FOOTER</p>
      </footer>
    </div>
  )
}
