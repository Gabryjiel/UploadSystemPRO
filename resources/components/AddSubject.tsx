import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { request, RoleContext } from '../utils'
import { InputText } from './InputText'
import { TextArea } from './TextArea'
import { Message, TMessage } from './Message'
import { Select } from './Select'
import { Loader } from './Loader'
import { TUniClassProps } from '../typings'

type Form = {
  name: string;
  semester: string;
  group: string;
  subgroup: string;
  description: string;
  code: string;
}

export const AddSubject = () => {
  const role = useContext(RoleContext)
  const { errors, register, handleSubmit, reset, formState } = useForm<Form>({ reValidateMode: 'onSubmit' })
  const [uniClassProps, setUniClassProps] = useState<TUniClassProps | null | undefined>(null)
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })

  useEffect(() => role !== 'student' ? (() => {
    request<TUniClassProps>('uni').then((data) => uniClassProps === null && setUniClassProps(data))
    return () => setUniClassProps(void 0)
  })() : void 0, [])

  const onSubmit = (payload: Form) => {
    if (role !== 'student') return request<void>('subjects', { method: 'post', body: JSON.stringify(payload) }).then(() => {
      reset({ name: '', group: '', subgroup: '', description: '' })
      setFeedback({ variant: 'success', text: 'You have successfully created a new class!'} )
    }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))

    return request<void>('subjects/join', { method: 'post', body: JSON.stringify(payload) }).then(() => {
      reset({ code: '' })
      setFeedback({ variant: 'success', text: 'You have successfully joined a new class!'} )
    }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
  }

  const validateName = (input: string) => {
    if (input === '') return 'Please enter a class name'
    if (input.length < 3) return 'Class name is too short'
    if (input.indexOf('\\') !== -1) return 'Class name contains a forbidden character!'
  }

  const validateSemester = (input: string) => {
    if (input === '') return 'Please select a semester'
  }

  const validateGroup = (input: string) => {
    if (input === '') return 'Please select a group'
  }

  const validateSubgroup = (input: string) => {
    if (input === '') return 'Please select a subgroup'
  }

  const validateDescription = (input: string) => {
    if (input === '') return 'Please provide a description for the class'
    if (input.length < 3) return 'Description is too short'
    if (input.indexOf('\\') !== -1) return 'Description contains a forbidden character!'
  }

  const validateCode = (input: string) => {
    if (input === '') return 'Please enter a invitation code'
    if (input.length < 3) return 'Invitation code is too short'
    if (input.indexOf('\\') !== -1) return 'Invitation code contains a forbidden character!'
  }

  const TeachersForm = () => (
    <form noValidate className={`grid gap-10 gap-y-5 grid-cols-3 w-full max-w-screen-lg mx-auto${uniClassProps === null ? ' opacity-50 pointer-events-none' : ''}`} onSubmit={handleSubmit(onSubmit)}>
      <InputText
        className='col-span-full' name='name' variant='underlined' label='class name' placeholder='class name'
        maxLength={64} ref={register({ validate: validateName })} error={errors?.name?.message}
      />
      <Select className='col-span-full sm:col-auto' name='semester' placeholder='semester' error={errors?.semester?.message} ref={register({ validate: validateSemester })}>
        {uniClassProps?.semesters.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
      </Select>
      <Select className='col-span-full sm:col-auto' name='group' placeholder='group name' error={errors?.group?.message} ref={register({ validate: validateGroup })}>
        {uniClassProps?.groups.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
      </Select>
      <Select className='col-span-full sm:col-auto' name='subgroup' placeholder='subgroup' error={errors?.subgroup?.message} ref={register({ validate: validateSubgroup })}>
        {uniClassProps?.subgroups.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
      </Select>
      <TextArea
        className='col-span-full' name='description' label='class description'
        ref={register({ validate: validateDescription })} error={errors?.description?.message}
      />
      <Message ctx={feedback} className='col-span-full' onClose={() => setFeedback({ text: '' })} />
      <input
        type='reset' value='reset' disabled={formState.isSubmitting || feedback.variant === 'success'}
        className={`mr-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white dark:hover:text-black focus:outline-none text-red-500 hover:bg-red-500 disabled:opacity-20 disabled:pointer-events-none`}
      />
      <input type='submit' value='create' disabled={formState.isSubmitting || feedback.variant === 'success'} className={`col-start-3 ml-auto mt-2 \
px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none`}
      />
    </form>
  )

  const StudentsForm = () => (
    <form noValidate className='stack w-full max-w-screen-lg mx-auto' onSubmit={handleSubmit(onSubmit)}>
      <InputText
        className='col-span-full' name='code' variant='underlined' label='invitation code' placeholder='invitation code'
        maxLength={64} ref={register({ validate: validateCode })} error={errors?.code?.message}
      />
      <Message ctx={feedback} className='w-full mt-4' onClose={() => setFeedback({ text: '' })} />
      <input type='submit' value='join' disabled={formState.isSubmitting || feedback.variant === 'success'} className={`col-auto ml-auto mt-4 \
px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none`}
      />
    </form>
  )

  return (
    <div className='stack'>
      <div className='hstack mb-5 justify-between'>
        <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 border-l-1 border-current select-none'>{role === 'student' ? 'join a class' : 'add a new class'}</h1>
        <Link className='self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to='/classes'>return</Link>
      </div>

      {role !== 'student' && uniClassProps === null && <Loader />}

      {role !== 'student' ? TeachersForm()  : StudentsForm()}
    </div>
  )
}
