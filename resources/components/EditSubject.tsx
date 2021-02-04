import React, { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { request } from '../utils'
import { InputText } from './InputText'
import { Message, TMessage } from './Message'
import { TSubject } from '../typings'
import { Select } from './Select'
import { Loader } from './Loader'

type Props = RouteComponentProps<{ id: string }> & {
  role: number;
}

const groupNames = ['1EF-DI', '2EF-DI', '3EF-DI', '1XF-XD', '2KE-KW']

export const EditSubject = (props: Props) => {
  const { errors, register, handleSubmit, reset, formState, setValue } = useForm({ mode: 'onSubmit' })
  const [subject, setSubject] = useState<TSubject | null | undefined>(null)
  const [groups, setGroups] = useState<string | null>(null)
  const [submitType, setSubmitType] = useState<'delete' | 'save' | null>(null)
  const [feedback, setFeedback] = useState<TMessage>({ text: '' })

  const classId = props.match.params.id

  useEffect(() => void (async () => {
    // await request<string[]>('groups').then(Object.values).then(setGroups)

    const subject = await request<TSubject>(`subjects/${classId}`)
    const { name, description, group, subgroup } = subject
    const formData = { name, description, group, subgroup }

    setSubject(subject)
    Object.entries(formData).forEach(([k, v]) => setValue(k, v))
  })(), [])

  const onSubmit = (payload: Record<string, string>) => {
    if (submitType === 'delete') {
      const msg = `Are you sure that you want to delete the class '${subject?.name}'?`
      return confirm(msg) && request<void>(`/subjects/${classId}`, { method: 'delete' }).then(() => {
        setSubject(void 0)
        setFeedback({ variant: 'success', text: `You have successfully deleted '${subject?.name}'!`} )
      }).catch(() => setFeedback({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
    }

    return request<string>(`subjects/${classId}`, { method: 'patch', body: JSON.stringify(payload) })
      .then(() => {
        setFeedback({ variant: 'success', text: 'You have successfully updated the information!'} )
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

  const disabled = () => subject === void 0 ? ' opacity-50 pointer-events-none' : ''

  return (
    <div className='stack'>
      <div className='hstack mb-5 justify-between'>
        <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 border-l-1 border-current select-none'>settings</h1>
        <Link className='self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`/classes/${classId}`}>return</Link>
      </div>

      {(subject === null || groups === null) && <Loader />}

      <form noValidate className={`grid gap-10 gap-y-5 grid-cols-2 w-full max-w-screen-lg mx-auto${(subject === null || groups === null) ? ' opacity-50 pointer-events-none' : ''}`} onSubmit={handleSubmit(onSubmit)}>
        <InputText
          className={`col-span-full${disabled()}`} name='name' variant='underlined' label='class name' placeholder='class name'
          required maxLength={64} ref={register({ validate: validateName })} error={errors?.name?.message}
        />
        <Select className={disabled()} name='group' placeholder='group name' error={errors?.group?.message} ref={register({ validate: validateGroup })}>
          {groupNames.map((v, i) => <option key={i} value={v}>{v}</option>)}
        </Select>
        <Select className={disabled()} name='subgroup' placeholder='subgroup' error={errors?.subgroup?.message} ref={register({ validate: validateSubgroup })}>
          {[...new Array(16)].map((v, i) => <option key={i} value={i+1}>L{i+1}</option>)}
        </Select>
        <InputText
          className={`col-span-full${disabled()}`} name='description' variant='underlined' label='class description' placeholder='class description'
          ref={register({ validate: validateDescription })} error={errors?.description?.message}
        />
        <Message ctx={feedback} className='col-span-full' onClose={() => setFeedback({ text: '' })} />
        <input
          type='submit' value='delete' onClick={() => setSubmitType('delete')} disabled={formState.isSubmitting || subject === void 0}
          className={`col-auto mr-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white dark:hover:text-black focus:outline-none text-red-500 hover:bg-red-500 disabled:cursor-wait disabled:opacity-20`}
        />
        <input
          type='submit' value='save' disabled={formState.isSubmitting || subject === void 0} onClick={() => setSubmitType('save')}
          className={`col-auto ml-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:cursor-wait disabled:opacity-20`}
        />
      </form>
    </div>
  )
}
