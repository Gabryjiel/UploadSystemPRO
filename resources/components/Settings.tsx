import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TUser } from '../typings'
import { request, RoleContext } from '../utils'
import { InputText } from './InputText'
import { Message, TMessage } from './Message'

type Form = {
  name: string;
  oldPassword: string;
  password: string;
  passwordConfirm: string;
}

export const Settings = () => {
  const role = useContext(RoleContext)
  const { errors, register, handleSubmit, setValue, watch, formState } = useForm<Form>({ reValidateMode: 'onSubmit' })
  const [submitType, setSubmitType] = useState<'delete' | 'save'> ('save')
  const [user, setUser] = useState<TUser | null | undefined>(null)
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })
  const oldPassword = watch('oldPassword')
  const password = watch('password')

  useEffect(() => {
    request<TUser>('account').then((data) => user === null && setUser(data))

    return () => setUser(void 0)
  }, [])

  useEffect(() => setValue('name', user?.name), [user])

  const onSubmit = (payload: Form) => {
    if (submitType === 'delete') {
      const msg = `Are you sure that you want to delete your account?`
      return confirm(msg) && request<void>('account', { method: 'delete' }).then(() => {
        setUser(void 0)
        setFeedback({ variant: 'success', text: `You have successfully deleted your account!`})
        request('logout', { method: 'post' })
        setTimeout(() => (location.href = '/'), 1000)
      }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
    }

    const { name, oldPassword, password, passwordConfirm } = payload

    const filtered = {
      ...name !== user?.name && { name },
      ...oldPassword && password && passwordConfirm && { oldPassword, password, passwordConfirm }
    }

    return request<void>('account', { method: 'PATCH', body: JSON.stringify(filtered) }).then(() => {
      user && name !== user.name && setUser({ ...user, name })
      setFeedback({ variant: 'success', text: 'You have successfully updated your personal information!'} )
    }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
  }

  const onUpgrade = () => {
    const msg = `Are you sure that you want to request for an account upgrade to role 'teacher'?`
    confirm(msg) && request<void>('account/upgrade', { method: 'post' }).then(() => {
      setFeedback({ variant: 'success', text: `You have successfully sent a request for an account upgrade! Please await administrator's response`} )
    }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
  }

  const validateName = (input: string) => {
    if (input === '') return 'Please enter your name'
    if (input.length < 3) return 'Your name is too short'
    if (input.indexOf('\\') !== -1) return 'Your name contains a forbidden character!'
  }

  const validateOldPassword = (input: string) => {
    if (input !== '' && password === '') return 'Please enter the new password'
    if (input === '') return
  }

  const validatePassword = (input: string) => {
    if (input === '') return
    if (oldPassword === '') return 'Please enter your old password'
    if (/[^\w!@#$%^&*-;:]/.test(input)) return 'Password contains a forbidden character'
    if (input.length < 6) return 'Password must contain at least 6 characters'
    if (!/(?=.*[\d])/.test(input)) return 'Password must contain at least one digit'
    if (!/(?=.*[A-Z])/.test(input)) return 'Password must contain at least one capital letter'
    if (!/(?=.*[a-z])/.test(input)) return 'Password must contain at least one lowercase letter'
    // if (!/(?=.*[!@#$%^&*-;:])/.test(input)) return 'Password must contain at least one special char'
  }

  const validatePasswordConfirm = (input: string) => {
    if (input !== '' && password === '') return 'Please enter the new password'
    if (password === '') return
    if (input !== password) return 'Passwords do not match!'
  }

  return (
    <div className='stack'>
      <div className='hstack justify-between'>
        <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 border-l-1 border-current select-none'>account settings</h1>
      </div>
      <h1 className='text-sm sm:text-base dark:font-light mb-5 italic ml-1'>
        <span>account type: {role}</span>
        {role === 'student' && (<>
          <span>{', '}</span>
          <span className='bg-gray-500 bg-opacity-30 p-1 text-xs sm:text-sm cursor-pointer' onClick={onUpgrade}>upgrade?</span>
        </>)}
      </h1>

      <form noValidate className='grid gap-10 gap-y-5 grid-cols-2 w-full max-w-screen-lg mx-auto' onSubmit={handleSubmit(onSubmit)}>
        <fieldset className='col-span-full border-current border-1 px-1 py-4'>
          <legend className='bg-gray-900 text-gray-200 dark:bg-gray-200 dark:text-black px-2 py-1 dark:font-medium'>change your user name</legend>
          <InputText
            className='mx-1' name='name' variant='underlined' label='name' placeholder='name'
            maxLength={32} ref={register({ validate: validateName })} error={errors?.name?.message}
          />
        </fieldset>

        <fieldset className='col-span-full mt-5 border-current border-1 px-1 py-4'>
          <legend className='bg-gray-900 text-gray-200 dark:bg-gray-200 dark:text-black px-2 py-1 dark:font-medium'>change your password</legend>
          <InputText
            className='mx-1' name='oldPassword' variant='underlined' label='old password' placeholder='old password'
            type='password' maxLength={64} ref={register({ validate: validateOldPassword })} error={errors?.oldPassword?.message}
          />
          <InputText
            className='mx-1 mt-4' name='password' variant='underlined' label='new password' placeholder='new password'
            type='password' maxLength={64} ref={register({ validate: validatePassword })} error={errors?.password?.message}
          />
          <InputText
            className='mx-1 mt-4' name='passwordConfirm' variant='underlined' label='confirm new password' placeholder='confirm new password'
            type='password' maxLength={64} ref={register({ validate: validatePasswordConfirm })} error={errors?.passwordConfirm?.message}
          />
        </fieldset>

        <Message ctx={feedback} className='col-span-full' onClose={() => setFeedback({ text: '' })} />

        <input
          onClick={() => setSubmitType('delete')}
          type='submit' value='delete account' disabled={formState.isSubmitting} className={`col-auto mr-auto mt-2 px-4 sm:px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white dark:hover:text-black focus:outline-none text-red-500 hover:bg-red-500 disabled:opacity-20 disabled:pointer-events-none`}
        />

        <input
          onClick={() => setSubmitType('save')}
          type='submit' value='save' disabled={formState.isSubmitting} className={`col-auto ml-auto mt-2 px-4 sm:px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none`}
        />
      </form>
    </div>
  )
}
