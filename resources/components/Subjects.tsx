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
      <div className='grid grid-cols-subjects items-center gap-2 font-medium dark:font-normal'>
        {subjects?.map(({ id, code, name, created_at }) => (
          <Fragment key={id}>
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(code)} flex items-center justify-center text-3xl sm:text-4xl font-normal text-white`}>{name[0]}</div>
            <div className='stack self-start ml-1 cursor-pointer min-w-0'>
              <span className='text-sm sm:text-xl overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{name}</span>
              <span className='text-xs font-normal dark:font-light'>3EF-DI</span>
            </div>
            <div className='text-center text-xs sm:text-base whitespace-nowrap'>
              <span>{new Date(created_at).toDateString().slice(4)}</span>
              <hr className='w-3 mx-auto border-current' />
              <span>{new Date(new Date(created_at).setMonth(new Date(created_at).getMonth() + 6)).toDateString().slice(4)}</span>
            </div>
            <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
              <span>15</span>
              <span>students</span>
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

      <button className='sm:hidden fixed bottom-20 right-5 p-0 w-12 h-12 bg-red-600 rounded-full hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none'>
        <svg className='w-6 h-6 inline-block' viewBox='0 0 20 20' enable-background='new 0 0 20 20'>
          <path fill='white' d='M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399C15.952,9,16,9.447,16,10z' />
        </svg>
      </button>
    </div>
  )
}
