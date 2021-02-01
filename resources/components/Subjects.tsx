import React, { useState, useEffect, Fragment } from 'react'
import { useForm } from 'react-hook-form'
import { request } from '../utils'
import { Loader } from './Loader'
import { InputText } from './InputText'
import { TSubject } from '../typings'

type Props = {
  role: number;
}

export const Subjects = (props: Props) => {
  const { register, reset } = useForm({ mode: 'onChange' })
  const [subjects, setSubjects] = useState<null | TSubject[]>(null)

  useEffect(() => {
    request<TSubject[]>('subjects').then(Object.values).then(setSubjects)
  }, [])

  const getBGColor = (code: string) => {
    const colors = ['yellow', 'green', 'gray', 'red', 'blue', 'indigo', 'purple']

    return `bg-${colors[code.charCodeAt(3) % 7]}-700`
  }

  const SubjectTable = () => {
    return (
      <div className='grid grid-classes items-center gap-2 font-medium dark:font-normal'>
        {subjects?.map(({ id, code, name, created_at }) => (
          <Fragment key={id}>
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(code)} flex items-center justify-center text-3xl sm:text-4xl font-normal text-white`}>{name[0]}</div>
            <div className='stack self-start ml-1 cursor-pointer'>
              <span className='text-sm sm:text-xl overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{name}</span>
              <span className='text-xs font-light'>3EF-DI</span>
            </div>
            <div className='text-center text-xs sm:text-base whitespace-nowrap'>
              <span>{new Date(created_at).toDateString().slice(4)}</span>
              <hr className='w-3 mx-auto border-current' />
              <span>{new Date(new Date(created_at).setMonth(new Date(created_at).getMonth() + 6)).toDateString().slice(4)}</span>
            </div>
            <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
              <span>15/15</span>
              <span>students</span>
            </div>
            <div className='text-xs sm:text-base'>
              <a className='cursor-pointer py-2 px-3 sm:px-5 border-1 font-medium border-black hover:bg-black hover:text-white dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-black'>open</a>
            </div>
            <div className='col-span-full border-b-1 border-current' />
          </Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className='stack'>
      <div className='hstack mb-5 justify-between'>
        <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 border-l-1 border-current select-none'>your classes</h1>
        <div className='min-w-0 my-auto w-44 md:w-52'>
          <InputText
            variant='outlined' placeholder='search' name='search' label='search'
            className='text-md' ref={register()} onClose={() => reset({ search: '' })}
          />
         </div>
      </div>

      <SubjectTable />
      {subjects === null && <Loader />}
    </div>
  )
}
