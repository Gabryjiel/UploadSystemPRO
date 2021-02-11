import React, { useEffect, useRef, RefObject, Dispatch, SetStateAction } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TRole } from '../typings'
import { toggleDarkMode } from '../utils'
import { Login } from '../components/Login'
import { Signup } from '../components/Signup'
import { IconLogo, IconDarkMode } from '../icons'

type Props = {
  setSession: Dispatch<SetStateAction<TRole | null | undefined>>;
}

export default function Landing ({ setSession }: Props) {
  const { pathname } = useLocation()

  const headerRef = useRef<HTMLDivElement>(null)
  const logInRef = useRef<HTMLDivElement>(null)
  const signUpRef = useRef<HTMLDivElement>(null)

  const scrollTo = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollTo(pathname === '/login' ? logInRef : pathname === '/signup' ? signUpRef : headerRef)
  }, [])

  return (
    <div className='stack'>
      <header className='hstack justify-between px-5 min-h-15 sm:min-h-10' ref={headerRef}>
        <Link to='/' className='hstack items-center space-x-2 text-lg md:text-2xl'>
          <IconLogo className='w-8' />
          <div className='stack font-bold text-center sm:flex-row sm:space-x-2'>
            <h1>Upload System</h1>
            <h1>PRO</h1>
          </div>
        </Link>
        <div className='hstack items-center text-lg space-x-5 md:space-x-8'>
          <Link to='/login' className='cursor-pointer' onClick={() => scrollTo(logInRef)}>Log In</Link>
          <Link to='/signup' className='cursor-pointer underline' onClick={() => scrollTo(signUpRef)}>Sign Up</Link>
          <IconDarkMode className='w-8 cursor-pointer' onClick={toggleDarkMode} />
        </div>
      </header>

      <main>
        <section className='stack items-center justify-center min-h-85 sm:min-h-90 bg-gradient-to-bl from-purple-300 to-purple-100 dark:from-gray-800 dark:to-gray-900'>
          <p className='text-4xl sm:text-6xl'>Upload System PRO</p>
          <p className='text-2xl sm:text-4xl mt-2 animate-type'>chores simplified </p>
          <div className='cursor-pointer bg-current rounded mt-4 px-4 py-2 sm:mt-8'>
            <Link to='/login' className='text-xl sm:text-2xl text-white dark:text-black' onClick={() => scrollTo(logInRef)}>Log In</Link>
          </div>
        </section>

        <section className='stack min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-blue-300 dark:from-gray-900 dark:to-gray-900' ref={logInRef}>
          <Login scrollTo={scrollTo} signUpRef={signUpRef} setSession={setSession} />
        </section>

        <section className='stack min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-800' ref={signUpRef}>
          <Signup scrollTo={scrollTo} logInRef={logInRef} />
        </section>
      </main>

      <footer className='stack text-center font-medium bg-gray-900 text-white dark:bg-gray-400 dark:text-black dark:font-bold'>
        <p className='py-10'>Copyright © 2021 Gabriel Kudyba, Andrii Nyzhnyk</p>
      </footer>
    </div>
  )
}
