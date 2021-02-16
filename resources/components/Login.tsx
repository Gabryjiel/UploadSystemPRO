import React, { useState, RefObject, Dispatch, SetStateAction } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import { InputText } from './InputText'
import { ButtonSubmit } from './ButtonSubmit'
import { InputCheckbox } from './InputCheckbox'
import { Message, TMessage } from './Message'
import { TRole } from '../typings'
import { request } from '../utils'

type Props = {
  scrollTo: (ref: RefObject<HTMLDivElement>) => void;
  signUpRef: RefObject<HTMLDivElement>;
  resetRef: RefObject<HTMLDivElement>;
  setSession: Dispatch<SetStateAction<TRole | null | undefined>>;
}

type Form = {
  email: string;
  password: string;
  rememberme: boolean;
}

type TSession = {
  role: TRole;
}

export const Login = (props: Props) => {
  const history = useHistory()

  const { scrollTo, signUpRef, resetRef, setSession } = props
  const [counter, setCounter] = useState<number>(0)
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })
  const { register, handleSubmit, errors, formState } = useForm<Form>({ reValidateMode: 'onSubmit' })

  const validateEmail = (input: string) => {
    if (input ===  '') return 'Please provide an email address'
    if (!isEmail(input)) return 'You must provide a valid email!'
  }

  const validatePassword = (input: string) => {
    if (input ===  '') return 'Please provide your password'
    if (input.length < 3) return 'Password is too short!'
  }

  const onLogin = (payload: Form) => {
    return request<void>('auth/login', { method: 'post', body: JSON.stringify(payload) }).then(async () => {
      await request<TSession>('account').then(({ role }) => setSession(role))
      history.push('/')
    }).catch(() => {
      setFeedback({ variant: 'error', text: 'Incorrect username or password.'})
      setCounter(counter + 1)
    })
  }

  return (
    <div className='stack justify-center bg-white dark:bg-gray-200 text-black w-full md:w-108 pb-8 pt-16 px-8 md:px-24 md:rounded-md'>
      <p className='text-3xl'>Log in to your account.</p>
      <form className='stack pt-3 md:pt-8' noValidate onSubmit={handleSubmit(onLogin)}>
        <InputText
          variant='underlined' type='email' name='email' placeholder='email address' label='email' maxLength={64}
          className='mb-4' ref={register({ validate: validateEmail })} error={errors?.email?.message}
        />

        <InputText
          variant='underlined' type='password' name='password' placeholder='password' label='password' maxLength={64}
          className='mb-4 mt-3 md:mt-4' ref={register({ validate: validatePassword })} error={errors?.password?.message}
        />

        <InputCheckbox name='rememberme' label='remember me' className='py-2' boxClassName='w-5 h-5' ref={register()} />

        <Message ctx={feedback} onClose={() => setFeedback({ text: '' })} />

        <ButtonSubmit value='Log In' isSubmitting={formState.isSubmitting} className='mt-8 md:mt-10' />
      </form>
      <div className='text-center pt-12'>
        {counter > 2 ? (
          <p>Forgot your password? <Link to='/reset' className='underline font-semibold' onClick={() => scrollTo(resetRef)}>Reset it here.</Link></p>
        ) : (
          <p>Don't have an account? <Link to='/signup' className='underline font-semibold' onClick={() => scrollTo(signUpRef)}>Signup here.</Link></p>
        )}
      </div>
    </div>
  )
}
