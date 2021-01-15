import React, { useState, RefObject } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import { InputText } from './InputText'
import { ButtonSubmit } from './ButtonSubmit'
import { Message, TMessage } from './Message'
import { request } from '../utils'

type Props = {
  scrollTo: (ref: RefObject<HTMLDivElement>) => void;
  logInRef: RefObject<HTMLDivElement>;
}

export const Signup = (props: Props) => {
  const { scrollTo, logInRef } = props
  const { register, handleSubmit, errors, watch, formState } = useForm({ mode: 'onBlur' })
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })
  const password = watch('password')

  const validateName = (input: string) => {
    if (input === '') return 'You need to enter your name'
  }

  const validateEmail = (input: string) => {
    if (input ===  '') return 'Please provide an email address'
    if (!isEmail(input)) return 'You must provide a valid email!'
  }

  const validatePassword = (input: string) => {
    if (/[^\w!@#$%^&*-;:]/.test(input)) return 'Password contains a forbidden character'
    if (input.length < 6) return 'Password must contain at least 6 characters'
    if (!/(?=.*[\d])/.test(input)) return 'Password must contain at least one digit'
    if (!/(?=.*[A-Z])/.test(input)) return 'Password must contain at least one capital letter'
    if (!/(?=.*[a-z])/.test(input)) return 'Password must contain at least one lowercase letter'
    // if (!/(?=.*[!@#$%^&*-;:])/.test(input)) return 'Password must contain at least one special char'
  }

  const validateConfirmPassword = (password: string) => (input: string) => {
    return input === password || 'Passwords do not match!'
  }

  const onSignUp = (payload: Record<string, string>) => {
    return request<string>('register', { method: 'post', body: JSON.stringify(payload) }).then(() => {
      setFeedback({ variant: 'success', text: 'You have successfully created your account. Please head over to the login page.' })
    }).catch((error) => {
      // TODO: add server error message support
      setFeedback({ variant: 'error', text: 'Something bad has happened. Please try again later' })
    })
  }

  return (
    <div className='stack justify-center bg-white w-full md:w-108 pb-8 pt-16 px-8 md:px-24 md:rounded-md'>
      <p className='text-3xl'>Join Us.</p>
      <form className='flex flex-col pt-3 md:pt-8' noValidate onSubmit={handleSubmit(onSignUp)}>
        <InputText
          type='text' name='name' placeholder='your name' label='name' maxLength={32} required
          ref={register({ validate: validateName })} error={errors?.name?.message}
        />

        <InputText
          type='email' name='email' placeholder='email address' label='email' maxLength={64} required
          className='mt-3 md:mt-4' ref={register({ validate: validateEmail })} error={errors?.email?.message}
        />

        <InputText
          type='password' name='password' placeholder='password' label='password' maxLength={64} required
          className='mt-3 md:mt-4' ref={register({ validate: validatePassword })} error={errors?.password?.message}
        />

        <InputText
          type='password' name='password_confirmation' placeholder='confirm password' label='confirm password'
          maxLength={64} required className='mt-3 md:mt-4' error={errors?.password_confirmation?.message}
          ref={register(({ validate: validateConfirmPassword(password) }))}
        />

        <Message ctx={feedback} onClose={() => setFeedback({ text: '' })} />

        <ButtonSubmit value='Register' isSubmitting={formState.isSubmitting} className='mt-10 md:mt-12' />
      </form>
      <div className='text-center pt-12'>
        <p>Already have an account? <Link to='/login' className='underline font-semibold' onClick={() => scrollTo(logInRef)}>Log in here.</Link></p>
      </div>
    </div>
  )
}
