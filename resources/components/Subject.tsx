import React, { useState, useEffect, Fragment, useContext } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { request, RoleContext } from '../utils'
import { Loader } from './Loader'
import { InputText } from './InputText'
import { TSubject, TAssignment } from '../typings'
import { IconPlus, IconEdit } from '../icons'

type Props = RouteComponentProps<{ id: string }>

export const Subject = (props: Props) => {
  const role = useContext(RoleContext)
  const [subject, setSubject] = useState<null | TSubject>(null)
  const [assignments, setAssignments] = useState<null | TAssignment[]>(null)
  const [search, setSearch] = useState<null | TAssignment[]>(null)
  const [query, setQuery] = useState<string>('')

  const classId = props.match.params.id

  useEffect(() => {
    request<TSubject & { assignments: TAssignment[] }>(`subjects/${classId}`).then(({ assignments, ...subject }) => {
      setSubject(subject)
      setAssignments(assignments)
    })
  }, [])

  useEffect(() => {
    if (query === '') return setSearch(null)
    const includes = (str: string, substr: string) => str.toLowerCase().indexOf(substr.toLocaleLowerCase()) !== -1

    const search = assignments ? assignments.filter(({ name }) => includes(name, query)) : null

    setSearch(search)
  }, [query])

  const getBGColor = (code: string) => {
    const colors = ['yellow', 'green', 'gray', 'red', 'blue', 'indigo', 'purple']

    return `bg-${colors[code.charCodeAt(3) % 7]}-700`
  }

  const AssignmentTable = (props: { content: TAssignment[] | null }): JSX.Element => {
    return (
      <div className='grid grid-cols-assignments items-center gap-2 font-medium dark:font-normal'>
        {props.content?.map(({ id, name, description, deadline }) => {
          const due = ~~((new Date(deadline).getTime() - Date.now()) / 8.64e7)
          return (
            <Fragment key={id}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(description)} flex items-center justify-center text-3xl sm:text-4xl font-normal text-white`}>{name[0]}</div>
              <Link to={`/assignments/${id}`} className='stack self-start ml-1 min-w-0'>
                <span className='text-sm sm:text-xl overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{name}</span>
                <span className='text-xs font-normal dark:font-light overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{description}</span>
              </Link>
              <div className='text-center text-xs sm:text-base whitespace-nowrap'>
                <span>{due < 0 ? 'ended' : due < 1 ? `${~~(due * 24)} hours` : `${due} days`}</span>
                <hr className='w-3 mx-auto border-current' />
                <span>{new Date(deadline).toLocaleDateString()}</span>
              </div>
              <div className={`stack text-center text-xs sm:text-base whitespace-nowrap${role === 'student' ? ' invisible' : ''}`}>
                <span>7 / 16</span>
                <span>answers</span>
              </div>
              <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
                <span>0</span>
                <span>new</span>
              </div>
              <div className='col-span-full border-b-1 border-current' />
            </Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <div className='stack'>
      <div className='hstack mb-2 justify-between'>
        <h1 className='text-xl sm:text-2xl px-1 pt-1 mt-1 border-l-1 border-current'>{subject?.name}</h1>
        <Link className='self-center p-3 py-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`/classes/${classId}/settings`}>
          <IconEdit className='w-5' />
        </Link>
      </div>
      <h1 className='sm:text-lg font-light ml-1 mb-5 overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{subject?.description}</h1>
      <div className='hstack justify-between mb-10'>
        <h1 className='text-lg sm:text-xl px-2 border-b-1 border-current'>assignments</h1>
        <div className='min-w-0 my-auto w-44 md:w-52'>
          <InputText
            variant='outlined' placeholder='search' name='search' onChange={({ currentTarget: { value } }) => setQuery(value)}
            label='search' className='text-md' value={query} onClose={() => setQuery('')}
          />
        </div>
        {role !== 'student' && (
          <Link className='hidden sm:block self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`/classes/${classId}/new`}>new</Link>
        )}
      </div>

      <AssignmentTable content={search ?? assignments} />
      {assignments === null && <Loader />}

      {role !== 'student' && (
        <Link to={`/classes/${classId}/new`} className='sm:hidden fixed bottom-20 flex justify-center right-5 w-12 h-12 bg-red-600 rounded-full hover:bg-red-700 active:shadow-lg shadow transition ease-in duration-200 focus:outline-none'>
          <IconPlus className='w-6 h-6 self-center' />
        </Link>
      )}
    </div>
  )
}
