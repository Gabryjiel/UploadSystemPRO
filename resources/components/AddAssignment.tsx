import React, { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { request } from '../utils'
import { InputText } from './InputText'
import { Message, TMessage } from './Message'
import { TextArea } from './TextArea'
import { InputDate } from './InputDate'
import { InputFile } from './InputFile'

type Props = RouteComponentProps<{ id: string }> & {
  role: number;
}

type TForm = {
  name: string;
  description: string;
  reference: FileList;
  deadline: string;
}

export const AddAssignment = (props: Props) => {
  const { errors, register, handleSubmit, reset, formState } = useForm<TForm>({ mode: 'onSubmit' })
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })

  const classId = props.match.params.id

  useEffect(() => {
    // request<string[]>('groups').then(Object.values).then(setGroups)
  }, [])

  const onSubmit = (payload: Record<string, string>) => {
    return request<string>('assignments', { method: 'post', body: JSON.stringify(payload) })
      .then(() => {
        // reset({ name: '', group: null, subgroup: null, description: '' })
        setFeedback({ variant: 'success', text: 'You have successfully created a new assignment!'} )
      })
      .catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
  }

  const validateName = (input: string) => {
    if (input === '') return 'Please enter a class name'
    if (input.length < 3) return 'Class name is too short'
    if (input.indexOf('\\') !== -1) return 'Class name contains a forbidden character!'
  }

  const validateDescription = (input: string) => {
    if (input === '') return 'Please provide a description for the assignment'
    if (input.length < 6) return 'Description is too short'
    if (input.indexOf('\\') !== -1) return 'Description contains a forbidden character!'
  }

  const validateDeadline = (input: string) => {
    if (input === '') return 'Please provide a deadline for the assignment'
  }

  const validateReference = (input: FileList) => {
    if (input.length > 1) return 'You can only attach one file per assignment'
    if (input[0]?.size > 67108864) return 'Sorry, but the file is too big (max 64MB)'
  }

  return (
    <div className='stack'>
      <div className='hstack mb-5 justify-between'>
        <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 border-l-1 border-current select-none'>create a new assignment</h1>
        <Link className='self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`/classes/${classId}`}>return</Link>
      </div>

      <form noValidate className='grid gap-10 gap-y-5 grid-cols-2 w-full max-w-screen-lg mx-auto' onSubmit={handleSubmit(onSubmit)}>
        <InputText
          className='col-span-full' name='name' variant='underlined' label='assignment name' placeholder='assignment name'
          required maxLength={64} ref={register({ validate: validateName })} error={errors?.name?.message}
        />

        <TextArea
          name='description' className='col-span-full' label='assignment description' rows={5} maxLength={2048}
          ref={register({ validate: validateDescription })} error={errors?.description?.message}
        />

        <InputFile
          name='reference' label='reference materials' className='col-span-full sm:col-auto'
          ref={register({ validate: validateReference })} error={errors?.reference?.message}
        />

        <InputDate
          className='col-span-full sm:col-auto'
          datetime name='deadline' label='deadline' min={`${new Date().toJSON().slice(0, 11)}00:00:00`}
          ref={register({ validate: validateDeadline })} error={errors?.deadline?.message}
        />

        <Message ctx={feedback} className='col-span-full' onClose={() => setFeedback({ text: '' })} />

        <input type='reset' value='reset' disabled={formState.isSubmitting} className={`col-auto mr-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white dark:hover:text-black focus:outline-none text-red-500 hover:bg-red-500 disabled:opacity-20 disabled:pointer-events-none`} />
        <input type='submit' value='create' disabled={formState.isSubmitting} className={`col-auto ml-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none`} />
      </form>
    </div>
  )
}

// php artisan migrate:refresh --seed
