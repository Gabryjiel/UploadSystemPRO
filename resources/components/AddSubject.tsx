import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { request } from '../utils'
import { InputText } from './InputText'
import { Message, TMessage } from './Message'
import { Select } from './Select'
import { Loader } from './Loader'

type Props = {
  role: number;
}

const groupNames = ['1EF-DI', '2EF-DI', '3EF-DI', '1XF-XD', '2KE-KW']

export const AddSubject = (props: Props) => {
  const { errors, register, handleSubmit, reset, formState } = useForm({ mode: 'onSubmit' })
  const [groups, setGroups] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })

  useEffect(() => {
    // request<string[]>('groups').then(Object.values).then(setGroups)
  }, [])

  const onSubmit = (payload: Record<string, string>) => {
    return request<string>('subjects', { method: 'post', body: JSON.stringify(payload) })
      .then(() => {
        reset({ name: '', group: null, subgroup: null, description: '' })
        setFeedback({ variant: 'success', text: 'You have successfully created a new class!'} )
      })
      .catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
  }

  const validateName = (input: string) => {
    if (input === '') return 'Please enter a class name'
    if (input.length < 3) return 'Class name is too short'
    if (input.indexOf('\\') !== -1) return 'Class name contains a forbidden character!'
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

  return (
    <div className='stack'>
      <div className='hstack mb-5 justify-between'>
        <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 border-l-1 border-current select-none'>add new class</h1>
        <Link className='self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to='/classes'>return</Link>
      </div>

      {groups === null && <Loader />}

      <form noValidate className={`grid gap-10 gap-y-5 grid-cols-2 w-full max-w-screen-lg mx-auto${groups === null ? ' opacity-50 pointer-events-none' : ''}`} onSubmit={handleSubmit(onSubmit)}>
        <InputText
          className='col-span-full' name='name' variant='underlined' label='class name' placeholder='class name'
          required maxLength={64} ref={register({ validate: validateName })} error={errors?.name?.message}
        />
        <Select name='group' placeholder='group name' error={errors?.group?.message} ref={register({ validate: validateGroup })}>
          {groupNames.map((v, i) => <option key={i} value={v}>{v}</option>)}
        </Select>
        <Select name='subgroup' placeholder='subgroup' error={errors?.subgroup?.message} ref={register({ validate: validateSubgroup })}>
          {[...new Array(16)].map((v, i) => <option key={i} value={i+1}>L{i+1}</option>)}
        </Select>
        <InputText
          className='col-span-full' name='description' variant='underlined' label='class description' placeholder='class description'
          ref={register({ validate: validateDescription })} error={errors?.description?.message}
        />
        <Message ctx={feedback} className='col-span-full' onClose={() => setFeedback({ text: '' })} />
        <input type='reset' value='reset' className={`col-auto mr-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white dark:hover:text-black focus:outline-none text-red-500 hover:bg-red-500`} />
        <input type='submit' value='create' disabled={formState.isSubmitting} className={`col-auto ml-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:cursor-wait disabled:opacity-20`} />
      </form>
    </div>
  )
}
