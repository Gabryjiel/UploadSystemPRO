import React, { useState, useEffect, useContext } from 'react'
import { Link, RouteComponentProps, Redirect, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { downloadFile, request, RoleContext } from '../utils'
import { InputText } from './InputText'
import { Message, TMessage } from './Message'
import { TextArea } from './TextArea'
import { InputDate } from './InputDate'
import { InputFile } from './InputFile'
import { TAssignment } from '../typings'

type Props = RouteComponentProps<{
  subjectId: string;
  assignmentId: string;
}>

type Form = {
  name: string;
  description: string;
  files: FileList | null;
  deadline: string;
}

export const EditAssignment = (props: Props) => {
  const history = useHistory()
  const role = useContext(RoleContext)
  const { errors, register, handleSubmit, setValue, formState } = useForm<Form>({ reValidateMode: 'onSubmit' })
  const [submitType, setSubmitType] = useState<'delete' | 'save'> ('save')
  const [assignment, setAssignment] = useState<TAssignment | null | undefined>(null)
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })

  const { subjectId, assignmentId } = props.match.params

  useEffect(() => {
    request<TAssignment>(`assignments/${assignmentId}`)
      .then((data) => assignment === null && setAssignment(data))
      .catch(({ code }) => code === 404 && history.push(`/classes`))

    return () => setAssignment(void 0)
  }, [])

  useEffect(() => {
    setValue('name', assignment?.name)
    setValue('description', assignment?.description)
    setValue('deadline', assignment?.deadline.slice(0, 10))
  }, [assignment])


  const onSubmit = (payload: Form) => {
    if (submitType === 'delete') {
      const msg = `Are you sure that you want to delete assigment '${assignment?.name}'?`
      return confirm(msg) && request<void>(`assignments/${assignmentId}`, { method: 'delete' }).then(() => {
        setAssignment(void 0)
        setFeedback({ variant: 'success', text: `You have successfully deleted '${assignment?.name}'!`} )
      }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
    }

    const { name, description, deadline, files } = payload

    const filtered = {
      ...name !== assignment?.name && { name },
      ...description !== assignment?.description && { description },
      ...deadline !== assignment?.deadline.slice(0, 10) && { deadline }
    }

    const body = new FormData()
    if (name !== assignment?.name)  body.append('name', payload.name)
    if (description !== assignment?.description) body.append('description', payload.description)
    if (deadline !== assignment?.deadline)  body.append('deadline', payload.deadline)
    if (files) Array.from(payload.files || []).forEach((f) => body.append('files[]', f))

    return request<void>(`/api/assignments/${assignmentId}`, { method: 'post', body }).then(async () => {
      assignment && setAssignment({ ...assignment, ...filtered })
      setFeedback({ variant: 'success', text: 'You have successfully updated the information!'} )
    }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later' }))
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
      <div className='hstack justify-between'>
        <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 border-l-1 border-current select-none'>edit assignment</h1>
        <Link
          className='self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200'
          to={assignment === void 0 ? `/classes/${subjectId}` : `../${assignmentId}`}
        >
          {'return'}
        </Link>
      </div>
      <h1 className='text-sm sm:text-base dark:font-light italic ml-1 mb-5 hstack items-center'>
        <span>reference materials: </span>
        <ul className='hstack mx-2 not-italic font-medium flex-wrap'>
          {assignment && assignment.files.length < 1 ? <li>{'none'}</li> : assignment?.files.map((file) => (
            <li className='flex px-2 mx-2 my-1 py-1 border-current border-1 cursor-pointer' key={file.id} onClick={() => downloadFile(file)}>{file.name}</li>)
          )}
        </ul>
      </h1>

      <form noValidate className='grid gap-10 gap-y-5 grid-cols-2 w-full max-w-screen-lg mx-auto' onSubmit={handleSubmit(onSubmit)}>
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

        <input
          onClick={() => setSubmitType('delete')}
          type='submit' value='delete' disabled={formState.isSubmitting} className={`col-auto mr-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white dark:hover:text-black focus:outline-none text-red-500 hover:bg-red-500 disabled:opacity-20 disabled:pointer-events-none`}
        />

        <input
          onClick={() => setSubmitType('save')}
          type='submit' value='save' disabled={formState.isSubmitting} className={`col-auto ml-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none`}
        />
      </form>

      {role === 'student' && <Redirect to='/' />}
    </div>
  )
}
