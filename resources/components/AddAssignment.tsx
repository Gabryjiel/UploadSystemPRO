import React, { useState, useContext } from 'react'
import { Link, RouteComponentProps, Redirect } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { request, RoleContext } from '../utils'
import { InputText } from './InputText'
import { Message, TMessage } from './Message'
import { TextArea } from './TextArea'
import { InputDate } from './InputDate'
import { InputFile } from './InputFile'

type Props = RouteComponentProps<{ subjectId: string; }>

type Form = {
  subject_id: number;
  name: string;
  description: string;
  files: FileList | null;
  deadline: string;
}

export const AddAssignment = (props: Props) => {
  const role = useContext(RoleContext)
  const { errors, register, handleSubmit, reset, formState } = useForm<Form>({ reValidateMode: 'onSubmit' })
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })

  const { subjectId } = props.match.params

  const onSubmit = async (payload: Form) => {
    const body = new FormData()
    body.append('subject_id', `${payload.subject_id}`)
    body.append('name', payload.name)
    body.append('description', payload.description)
    body.append('deadline', payload.deadline)
    Array.from(payload.files || []).forEach((f) => body.append('files', f))

    return request<void>('assignments', { method: 'post', body }).then(() => {
      reset({ name: '', description: '', files: null,  deadline: '' })
      setFeedback({ variant: 'success', text: 'You have successfully created a new assignment!'} )
    }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
  }

  const validateName = (input: string) => {
    if (input === '') return 'Please enter an assignment name'
    if (input.length < 3) return 'Assignment name is too short'
    if (input.indexOf('\\') !== -1) return 'Assignment name contains a forbidden character!'
  }

  const validateDescription = (input: string) => {
    if (input.indexOf('\\') !== -1) return 'Description contains a forbidden character!'
  }

  const validateDeadline = (input: string) => {
    if (input === '') return 'Please provide a deadline for the assignment'
  }

  const validateReference = (input: FileList) => {
    if (input.length > 5) return 'You can only attach up to 5 file per assignment'
    if (Array.from(input).reduce((c, a) => c + a.size, 0) > 67108864) return 'Sorry, but the payload is too big (max 64MB)'
  }

  return (
    <div className='stack'>
      <div className='hstack mb-5 justify-between'>
        <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 border-l-1 border-current select-none'>create a new assignment</h1>
        <Link className='self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`/classes/${subjectId}`}>return</Link>
      </div>

      <form noValidate className='grid gap-10 gap-y-5 grid-cols-2 w-full max-w-screen-lg mx-auto' onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' value={subjectId} name='subject_id' ref={register()} />

        <InputText
          className='col-span-full' name='name' variant='underlined' label='assignment name' placeholder='assignment name'
          maxLength={64} ref={register({ validate: validateName })} error={errors?.name?.message}
        />

        <TextArea
          name='description' className='col-span-full' label='assignment description' rows={5} maxLength={2048}
          ref={register({ validate: validateDescription })} error={errors?.description?.message}
        />

        <InputFile
          name='files' label='reference materials' className='col-span-full sm:col-auto'
          ref={register({ validate: validateReference })} error={errors?.files?.message} multiple
        />

        <InputDate
          className='col-span-full sm:col-auto'
          name='deadline' label='deadline' min={new Date(Date.now() + 8.64e7).toJSON().slice(0, 10)}
          ref={register({ validate: validateDeadline })} error={errors?.deadline?.message}
        />

        <Message ctx={feedback} className='col-span-full' onClose={() => setFeedback({ text: '' })} />

        <input type='reset' value='reset' disabled={formState.isSubmitting} className={`col-auto mr-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white dark:hover:text-black focus:outline-none text-red-500 hover:bg-red-500 disabled:opacity-20 disabled:pointer-events-none`} />
        <input type='submit' value='create' disabled={formState.isSubmitting} className={`col-auto ml-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none`} />
      </form>

      {role === 'student' && <Redirect to='/' />}
    </div>
  )
}
