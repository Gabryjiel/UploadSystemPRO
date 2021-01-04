import React, { RefObject } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  scrollTo: (ref: RefObject<HTMLDivElement>) => void;
  logInRef: RefObject<HTMLDivElement>;
}

export const Signup = (props: Props) => {
  const { scrollTo, logInRef } = props

  return (
    <div className='stack justify-center bg-white w-full md:w-auto pb-8 pt-16 px-8 md:px-24 md:rounded-md'>
      <p className='text-3xl'>Join Us.</p>
      <form className='flex flex-col pt-3 md:pt-8' onSubmit={(event) => event.preventDefault()}>
        <div className='input'>
          <input
            type='text' name='name' placeholder='your name' autoCapitalize='off'
            autoComplete='off' autoCorrect='off' spellCheck='false' required />
          <span>name</span>
        </div>

        <div className='input mt-3 md:mt-4'>
          <input
            type='email' name='email' placeholder='email address' autoCapitalize='off'
            autoComplete='off' autoCorrect='off' spellCheck='false' required />
          <span>email</span>
        </div>

        <div className='input mt-3 md:mt-4'>
          <input
            type='password' name='password' placeholder='password' autoCapitalize='off'
            autoComplete='off' autoCorrect='off' spellCheck='false' required />
          <span>password</span>
        </div>

        <div className='input mt-3 md:mt-4'>
          <input
            type='password' name='confirm_password' placeholder='confirm password' autoCapitalize='off'
            autoComplete='off' autoCorrect='off' spellCheck='false' required />
          <span>confirm password</span>
        </div>

        <input type='submit' value='Register' className='bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-10 md:mt-12' />
      </form>
      <div className='text-center pt-12'>
        <p>Already have an account? <Link to='/login' className='underline font-semibold' onClick={() => scrollTo(logInRef)}>Log in here.</Link></p>
      </div>
    </div>
  )
}
