import React, { useState, RefObject } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import { InputText } from './InputText'
import { ButtonSubmit } from './ButtonSubmit'
import { Message, TMessage } from './Message'
import { request } from '../utils'
import { TResponse } from '../typings'

type Props = {
  scrollTo: (ref: RefObject<HTMLDivElement>) => void;
  logInRef: RefObject<HTMLDivElement>;
}

type Form = {
  email: string;
}

export const Reset = (props: Props) => {
  const { scrollTo, logInRef } = props
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })
  const { register, handleSubmit, errors, formState } = useForm<Form>({ reValidateMode: 'onSubmit' })

  const validateEmail = (input: string) => {
    if (input ===  '') return 'Please provide an email address'
    if (!isEmail(input)) return 'You must provide a valid email!'
  }

  const onSubmit = (payload: Form) => {
    return request<TResponse>('auth/reset', { method: 'post', body: JSON.stringify(payload) }).then(({ message }) => {
      setFeedback({ variant: 'success', text: message })
    }).catch(({ code, message }) => {
      setFeedback({ variant: 'error', text: code !== 500 ? message : 'Something bad has happened. Please try again later' })
    })
  }

  return (
    <div className='stack justify-center bg-white dark:bg-gray-200 text-black w-full md:w-108 pb-8 pt-16 px-8 md:px-24 md:rounded-md'>
      <p className='text-3xl'>Reset your password.</p>
      <form className='stack pt-3 md:pt-8' noValidate onSubmit={handleSubmit(onSubmit)}>
        <InputText
          variant='underlined' type='email' name='email' placeholder='email address' label='email' maxLength={64}
          className='mb-4' ref={register({ validate: validateEmail })} error={errors?.email?.message}
        />

        <Message ctx={feedback} onClose={() => setFeedback({ text: '' })} />

        <ButtonSubmit value='Reset' isSubmitting={formState.isSubmitting} className='mt-8 md:mt-10' />
      </form>
      <div className='text-center pt-12'>
        <p>Already recovered your account? <Link to='/signup' className='underline font-semibold' onClick={() => scrollTo(logInRef)}>Log in here.</Link></p>
      </div>
    </div>
  )
}
