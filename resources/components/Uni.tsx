import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Redirect } from 'react-router-dom'
import { IconClose, IconDone } from '../icons'
import { TGroup, TSemester, TSubgroup, TUniClassProps } from '../typings'
import { request, RoleContext } from '../utils'
import { InputText } from './InputText'

type TForm = {
  name: string;
}

type TBoxProps = {
  label: keyof TUniClassProps;
  content?: TSemester[] | TGroup[] | TSubgroup[];
}

const Box = (props: TBoxProps) => {
  const { label } = props

  const [content, setContent] = useState<TSemester[] | TGroup[] | TSubgroup[]>(props.content || [])
  const [oldContent, setOldContent] = useState<TSemester[] | TGroup[] | TSubgroup[]>(props.content || [])
  const { register, errors, handleSubmit, reset, formState } = useForm<TForm>({ reValidateMode: 'onSubmit' })

  useEffect(() => {
    setContent(props.content || [])
    setOldContent(props.content || [])
  }, [props.content])

  const onAdd = (payload: TForm) => {
    return request<TSemester | TGroup | TSubgroup>(`uni/${label}`, { method: 'post', body: JSON.stringify(payload) }).then((data) => {
      const merged = [...content, data]

      reset({ name: '' })

      setContent(merged)
      setOldContent(merged)
    })
  }

  const onDelete = async (targetId: number, targetName: string) => {
    const msg = `Are you sure that you want to delete item '${targetName}'`
    if (!confirm(msg)) return

    await request(`uni/${label}/${targetId}`, { method: 'delete' })
    setContent(content.filter(({ id }) => id !== targetId))
  }

  const onEdit = async (id: number, name: string) => {
    await request<TSemester | TGroup | TSubgroup>(`uni/${label}/${id}`, { method: 'PATCH', body: JSON.stringify({ id, name }) })
    setOldContent(content)
  }

  const validate = (input: string) => {
    if (input === '') return 'Name is required'
    if (input.indexOf('\\') !== -1) return 'Name contains a forbidden character!'
    if (input.length < 2) return 'Name is too short'
  }

  const onChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value
    setContent(content.map((c, i) => i === index ? { ...c, name } : c))
  }

  return (
    <fieldset className='border-current border-1 px-2 py-4 mb-5 mr-2 flex-grow sm:flex-grow-0'>
      <legend className='bg-gray-900 text-gray-200 dark:bg-gray-200 dark:text-black px-2 py-1 dark:font-medium'>{label}</legend>
      <form className='hstack items-center' onSubmit={handleSubmit(onAdd)}>
        <InputText
          className='mx-2 mb-4' name='name' variant='underlined' label='name' placeholder='name' maxLength={32}
          ref={register({ validate })} error={errors.name?.message}
        />
        <input
          type='submit' value='add' disabled={formState.isSubmitting}
          className={`ml-auto py-1 px-2 sm:px-4 border-current border-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none`}
        />
      </form>
      <ul className='mx-2'>
        {content?.map(({ id, name }, i) => (
          <li key={id} className='hstack px-2 py-2 border-current border-b-1 items-center'>
            <input
              className='w-full bg-transparent border-none focus:outline-none' value={content[i].name} onChange={onChange(i)}
              type='text' autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false'
            />

            <IconDone
              className={`ml-auto mr-2 w-4 text-green-500 cursor-pointer${oldContent.find(({ id: ind }) => ind === id)?.name === name ? ' invisible' : ''}`}
              onClick={() => onEdit(id, name)}
            />

            <IconClose className='w-3 text-red-500 cursor-pointer' onClick={() => onDelete(id, name)} />
          </li>
        ))}
      </ul>
    </fieldset>
  )
}

export const Uni = () => {
  const role = useContext(RoleContext)
  const [uni, setUni] = useState<TUniClassProps | null | undefined>(null)

  useEffect(() => {
    request<TUniClassProps>('uni').then((data) => uni === null && setUni(data))

    return () => setUni(void 0)
  }, [])

  return (
    <div className='flex flex-row flex-wrap justify-center sm:justify-between'>
      <Box label='semesters' content={uni?.semesters} />
      <Box label='groups' content={uni?.groups} />
      <Box label='subgroups' content={uni?.subgroups} />

      {role !== 'admin' && <Redirect to='/' />}
    </div>
  )
}
