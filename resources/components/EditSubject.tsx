import React, { useState, useEffect, useContext } from 'react'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { request, RoleContext } from '../utils'
import { InputText } from './InputText'
import { TextArea } from './TextArea'
import { Message, TMessage } from './Message'
import { TSubject, TUniClassProps } from '../typings'
import { Select } from './Select'
import { Loader } from './Loader'

type Props = RouteComponentProps<{ id: string; }>

type Form = {
  name: string;
  group: string;
  semester: string;
  subgroup: string;
  description: string;
}

export const EditSubject = (props: Props) => {
  const history = useHistory()
  const role = useContext(RoleContext)
  const { errors, register, handleSubmit, formState, setValue } = useForm<Form>({ reValidateMode: 'onSubmit' })
  const [subject, setSubject] = useState<TSubject | null | undefined>(null)
  const [uniClassProps, setUniClassProps] = useState<TUniClassProps | null | undefined>(null)
  const [submitType, setSubmitType] = useState<'delete' | 'save' | 'leave' | null>(null)
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })

  const classId = props.match.params.id

  useEffect(() => {
    request<TSubject>(`subjects/${classId}`)
      .then((data) => subject === null && setSubject(data))
      .catch(({ code }) => code === 404 && history.push('/classes'))

    if (role !== 'student') {
      request<TUniClassProps>('subjects/form').then((data) => uniClassProps === null && setUniClassProps(data))
    }

    return () => {
      setSubject(void 0)
      setUniClassProps(void 0)
    }
  }, [])

  useEffect(() => {
    setValue('name', subject?.name)
    setValue('description', subject?.description)
    setValue('semester', subject?.semester.id)
    setValue('group', subject?.group.id)
    setValue('subgroup', subject?.subgroup.id)
  }, [subject, uniClassProps])

  const onSubmit = (payload: Form) => {
    if (submitType === 'delete') {
      const msg = `Are you sure that you want to delete the class '${subject?.name}'?`
      return confirm(msg) && request<void>(`/subjects/${classId}`, { method: 'delete' }).then(() => {
        setSubject(void 0)
        setFeedback({ variant: 'success', text: `You have successfully deleted '${subject?.name}'!`} )
      }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
    }

    if (submitType === 'save') {
      return request<void>(`subjects/${classId}`, { method: 'patch', body: JSON.stringify(payload) }).then(() => {
        setFeedback({ variant: 'success', text: 'You have successfully updated the information!'} )
      }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
    }

    return request<void>(`subjects/${classId}/leave`, { method: 'post' }).then(() => {
      setSubject(void 0)
      setFeedback({ variant: 'success', text: 'You have successfully left this class!'} )
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

  const disabled = () => subject === void 0 ? ' opacity-50 pointer-events-none' : ''

  const TeacherForm = () => (
    <form noValidate className={`grid gap-10 gap-y-5 grid-cols-3 w-full max-w-screen-lg mx-auto${(subject === null || uniClassProps === null) ? ' opacity-50 pointer-events-none' : ''}`} onSubmit={handleSubmit(onSubmit)}>
      <InputText
        className={`col-span-full${disabled()}`} name='name' variant='underlined' label='class name' placeholder='class name'
        maxLength={64} ref={register({ validate: validateName })} error={errors?.name?.message}
      />
      <Select className={`col-span-full sm:col-auto${disabled()}`} name='semester' placeholder='semester' error={errors?.semester?.message} ref={register({ validate: validateSemester })}>
        {uniClassProps?.semesters.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
      </Select>
      <Select className={`col-span-full sm:col-auto${disabled()}`} name='group' placeholder='group name' error={errors?.group?.message} ref={register({ validate: validateGroup })}>
        {uniClassProps?.groups.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
      </Select>
      <Select className={`col-span-full sm:col-auto${disabled()}`} name='subgroup' placeholder='subgroup' error={errors?.subgroup?.message} ref={register({ validate: validateSubgroup })}>
        {uniClassProps?.subgroups.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
      </Select>
      <TextArea
        className={`col-span-full${disabled()}`} name='description' label='class description'
        ref={register({ validate: validateDescription })} error={errors?.description?.message}
      />
      <Message ctx={feedback} className='col-span-full' onClose={() => setFeedback({ text: '' })} />
      <input
        type='submit' value='delete' onClick={() => setSubmitType('delete')} disabled={formState.isSubmitting || subject === void 0}
        className={`mr-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white dark:hover:text-black focus:outline-none text-red-500 hover:bg-red-500 disabled:opacity-20 disabled:pointer-events-none`}
      />
      <input
        type='submit' value='save' disabled={formState.isSubmitting || subject === void 0} onClick={() => setSubmitType('save')}
        className={`col-start-3 ml-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none`}
      />
    </form>
  )

  const StudentForm = () => (
    <form noValidate className='stack w-full' onSubmit={handleSubmit(onSubmit)}>
      <Message ctx={feedback} className='col-span-full' onClose={() => setFeedback({ text: '' })} />
      <input
        type='submit' value='leave' onClick={() => setSubmitType('leave')} disabled={formState.isSubmitting || !subject}
        className={`col-auto mr-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white dark:hover:text-black focus:outline-none text-red-500 hover:bg-red-500 disabled:opacity-20 disabled:pointer-events-none`}
      />
    </form>
  )

  return (
    <div className='stack'>
      <div className='hstack mb-2 justify-between'>
        <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 border-l-1 border-current select-none'>settings</h1>
        <Link
          className='self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200'
          to={subject === void 0 ? '/classes' : `/classes/${classId}`}
        >
          {'return'}
        </Link>
      </div>
      <h1 className='sm:text-lg dark:font-light ml-1'>{subject?.name || ' '}</h1>
      <h1 className='text-sm sm:text-base dark:font-light ml-1 mb-5'>invitation code: {subject?.code}</h1>

      {(subject === null || (role !== 'student' && uniClassProps === null)) && <Loader />}

      {role !== 'student' ? TeacherForm()  : StudentForm()}
    </div>
  )
}
