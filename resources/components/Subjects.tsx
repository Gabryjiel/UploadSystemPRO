import React, { useState, useEffect, useContext, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { request, RoleContext, getBGColor } from '../utils'
import { Loader } from './Loader'
import { InputText } from './InputText'
import { TSubject } from '../typings'
import { IconPlus } from '../icons'

export const Subjects = () => {
  const role = useContext(RoleContext)
  const [subjects, setSubjects] = useState<TSubject[] | null | undefined>(null)
  const [search, setSearch] = useState<TSubject[] | null>(null)
  const [query, setQuery] = useState<string>('')

  useEffect(() => {
    request<TSubject[]>('subjects').then(Object.values).then((data) => subjects === null && setSubjects(data))
    return () => setSubjects(void 0)
  }, [])

  useEffect(() => {
    if (query === '') return setSearch(null)
    const includes = (str: string, substr: string) => str.toLowerCase().indexOf(substr.toLocaleLowerCase()) !== -1

    const search = subjects ? subjects.filter(({ name, group }) => includes(name, query) || includes(group.name, query)) : null

    setSearch(search)
  }, [query])

  const SubjectTable = (props: { content?: TSubject[] | null }): JSX.Element => {
    return (
      <div className='grid grid-cols-subjects items-center gap-2 font-medium dark:font-normal'>
        {props.content?.map(({ id, description, name, students, group, subgroup, semester, assignments }) => (
          <Fragment key={id}>
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(description.charCodeAt(3) % 7)} flex items-center justify-center text-3xl sm:text-4xl font-normal text-white`}>{name[0]}</div>
            <Link to={`/classes/${id}`} className='stack self-start ml-1 min-w-0'>
              <span className='text-sm sm:text-xl overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{name}</span>
              <span className='text-xs font-normal dark:font-light'>{semester} | {group} | {subgroup}</span>
            </Link>
            <div className={`text-center text-xs sm:text-base whitespace-nowrap${role === 'student' ? ' invisible' : ''}`}>
              <span>{`${assignments} assignments`}</span>
              <hr className='w-3 mx-auto mt-1 border-current' />
              <span>13 new</span>
            </div>
            <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
              <span>{students}</span>
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
            variant='outlined' placeholder='search' name='search' onChange={({ currentTarget: { value } }) => setQuery(value)}
            label='search' className='text-md' value={query} onClose={() => setQuery('')}
          />
         </div>
        <Link
          to='/classes/new'
          className='hidden sm:block self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200'
        >
          {role === 'student' ?  'join' : 'new'}
        </Link>
      </div>

      <SubjectTable content={search ?? subjects} />
      {subjects === null && <Loader />}

      <Link to='/classes/new' className='sm:hidden fixed bottom-20 flex justify-center right-5 w-12 h-12 bg-red-600 rounded-full hover:bg-red-700 active:shadow-lg shadow transition ease-in duration-200 focus:outline-none'>
        <IconPlus className='w-6 h-6 self-center' />
      </Link>
    </div>
  )
}
