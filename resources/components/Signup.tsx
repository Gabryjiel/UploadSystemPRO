import React, { useState, useEffect, RefObject } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import { InputText } from './InputText'
import { ButtonSubmit } from './ButtonSubmit'
import { Message, TMessage } from './Message'
import { request } from '../utils'
import { IconDone, IconFail } from '../icons'

type Props = {
  scrollTo: (ref: RefObject<HTMLDivElement>) => void;
  logInRef: RefObject<HTMLDivElement>;
  confirm: boolean;
}

type Form = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const Signup = (props: Props) => {
  const { scrollTo, logInRef, confirm } = props

  const history = useHistory()
  const { register, handleSubmit, errors, watch, formState } = useForm<Form>({ reValidateMode: 'onSubmit' })
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })
  const [confirmation, setConfirmation] = useState<boolean | null>(null)
  const password = watch('password')

  useEffect(() => void (confirm && (() => {
    const key = new URLSearchParams(location.search).get('key')

    if (!key) return history.push('/')
    request<void>(`auth/register/${key}`).then(() => setConfirmation(true)).catch(() => setConfirmation(false))
  })()), [])

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

  const onSignUp = (payload: Form) => {
    return request<void>('auth/register', { method: 'post', body: JSON.stringify(payload) }).then(() => {
      setFeedback({ variant: 'success', text: 'You have successfully created your account. We have sent you a confirmation email to your inbox.' })
    }).catch(({ code, message }) => {
      setFeedback({ variant: 'error', text: code !== 500 ? message : 'Something bad has happened. Please try again later' })
    })
  }

  return (
    <div className='stack justify-center bg-white dark:bg-gray-200 text-black w-full md:w-108 pb-8 pt-16 px-8 md:px-24 md:rounded-md'>
      <p className='text-3xl'>{confirm ? 'Confirmation.' : 'Join Us.'}</p>
      {confirm ? (
        <div className='flex flex-col pt-3 md:pt-8 items-center'>
          {confirmation === null ? (<>
            <div className='w-40 h-40 bg-gray-500 rounded-full animate-pulse' />
            <div className='mt-2 w-full h-6 bg-gray-500 animate-pulse' />
          </>) : confirmation ? (<>
            <IconDone className='w-40' />
            <span className='mt-2'>{'You have successfully confirmed your account. Pease head over to the login page'}</span>
          </>) : (<>
            <IconFail className='w-40' />
            <span className='mt-2'>{'Something bad has happened. Or maybe you should not be here?'}</span>
          </>)}
        </div>
      ) : (
        <form className='flex flex-col pt-3 md:pt-8' noValidate onSubmit={handleSubmit(onSignUp)}>
          <InputText
            variant='underlined' type='text' name='name' placeholder='your name' label='name' maxLength={32}
            className='mb-4' ref={register({ validate: validateName })} error={errors?.name?.message}
          />

          <InputText
            variant='underlined' type='email' name='email' placeholder='email address' label='email' maxLength={64}
            className='mb-4 mt-3 md:mt-4' ref={register({ validate: validateEmail })} error={errors?.email?.message}
          />

          <InputText
            variant='underlined' type='password' name='password' placeholder='password' label='password' maxLength={64}
            className='mb-4 mt-3 md:mt-4' ref={register({ validate: validatePassword })} error={errors?.password?.message}
          />

          <InputText
            variant='underlined' type='password' name='password_confirmation' placeholder='confirm password' label='confirm password'
            maxLength={64} className='mb-4 mt-3 md:mt-4' error={errors?.password_confirmation?.message}
            ref={register(({ validate: validateConfirmPassword(password) }))}
          />

          <Message ctx={feedback} onClose={() => setFeedback({ text: '' })} />

          <ButtonSubmit value='Register' isSubmitting={formState.isSubmitting} className='mt-10 md:mt-12' />
        </form>
      )}
      <div className='text-center pt-12'>
        <p>Already have an account? <Link to='/login' className='underline font-semibold' onClick={() => scrollTo(logInRef)}>Log in here.</Link></p>
      </div>
    </div>
  )
}
