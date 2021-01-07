import React, { RefObject } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import { InputText } from './InputText'
import { ButtonSubmit } from './ButtonSubmit'
import { request, setCreds } from '../utils'

type Props = {
  scrollTo: (ref: RefObject<HTMLDivElement>) => void;
  signUpRef: RefObject<HTMLDivElement>;
}

export const Login = (props: Props) => {
  const { scrollTo, signUpRef } = props
  const { register, handleSubmit, errors } = useForm()

  const validateEmail = (input: string) => {
    if (input ===  '') return 'Please provide an email address'
    if (!isEmail(input)) return 'You must provide a valid email!'
  }

  const validatePassword = (input: string) => {
    if (input ===  '') return 'Please provide your password'
    if (input.length < 3) return 'Password is too short!'
  }

  const onLogin = (payload: Record<string, string>) => {
    return request<string>('login', { method: 'post', body: JSON.stringify(payload) }).then(async (data) => {
      // TODO: handle auth
    }).catch(({ code, message }) => {})
  }

  return (
    <div className='stack justify-center bg-white w-full md:w-auto pb-8 pt-16 px-8 md:px-24 md:rounded-md'>
      <p className='text-3xl'>Log in to your account.</p>
      <form className='stack pt-3 md:pt-8' noValidate onSubmit={handleSubmit(onLogin)}>
        <InputText
          type='email' name='email' placeholder='email address' label='email' maxLength={64} required
          ref={register({ validate: validateEmail })} error={errors?.email?.message}
        />

        <InputText
          type='password' name='password' placeholder='password' label='password' maxLength={64} required
          className='mt-3 md:mt-4' ref={register({ validate: validatePassword })} error={errors?.password?.message}
        />

        <ButtonSubmit value='Log In' className='mt-10 md:mt-12' />
      </form>
      <div className='text-center pt-12'>
        <p>Don't have an account? <Link to='/signup' className='underline font-semibold' onClick={() => scrollTo(signUpRef)}>Signup here.</Link></p>
      </div>
    </div>
  )
}
