import React, { useState, useEffect, Fragment, useContext } from 'react'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { request, RoleContext, getBGColor } from '../utils'
import { Loader } from './Loader'
import { InputText } from './InputText'
import { TSubject, TAssignmentProps } from '../typings'
import { IconPlus, IconEdit, IconStar } from '../icons'

type Props = RouteComponentProps<{ subjectId: string; }>

export const Subject = (props: Props) => {
  const history = useHistory()
  const role = useContext(RoleContext)
  const [subject, setSubject] = useState<TSubject | null | undefined>(null)
  const [search, setSearch] = useState<TAssignmentProps[] | null>(null)
  const [query, setQuery] = useState<string>('')

  const { subjectId } = props.match.params

  useEffect(() => {
    request<TSubject>(`subjects/${subjectId}`)
      .then((data) => subject === null && setSubject(data))
      .catch(({ code }) => code === 404 && history.push('/classes'))

    return () => setSubject(void 0)
  }, [])

  useEffect(() => {
    if (query === '') return setSearch(null)
    const includes = (str: string, substr: string) => str.toLowerCase().indexOf(substr.toLocaleLowerCase()) !== -1

    const search = subject?.assignments ? subject?.assignments.filter(({ name }) => includes(name, query)) : null

    setSearch(search)
  }, [query])

  const AssignmentTable = (props: { content?: TAssignmentProps[] | null }): JSX.Element => {
    return (
      <div className='grid grid-cols-assignments items-center gap-2 font-medium dark:font-normal'>
        {props.content?.map(({ id, name, description, deadline, answers, students, not_graded, ends_in }) => {
          return (
            <Fragment key={id}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(description.charCodeAt(3) % 7)} flex items-center justify-center text-3xl sm:text-4xl font-normal text-white`}>{name[0]}</div>
              <Link to={`${subjectId}/assignments/${id}`} className='stack self-start ml-1 min-w-0'>
                <span className='text-sm sm:text-xl overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{name}</span>
                <span className='text-xs font-normal dark:font-light overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{description}</span>
              </Link>
              <div className={`text-center text-xs sm:text-base whitespace-nowrap${role === 'student' ? ' col-start-3 col-end-5' : ''}`}>
                <span>{ends_in}</span>
                <hr className='w-3 mx-auto border-current' />
                <span>{new Date(deadline).toLocaleDateString()}</span>
              </div>
              {role !== 'student' && (
                <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
                  <span>{answers} / {students}</span>
                  <span>answers</span>
                </div>
              )}
              <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
                {role !== 'student' ? (<>
                  <span>{not_graded}</span>
                  <span>new</span>
                </>) : (
                  answers < 1 && <IconStar className='w-4 sm:w-6' />
                )}
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
        <Link className='self-center p-3 py-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`/classes/${subjectId}/settings`}>
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
          <Link className='hidden sm:block self-center border-current border-1 px-3 py-1 cursor-pointer hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`/classes/${subjectId}/new`}>new</Link>
        )}
      </div>

      <AssignmentTable content={search ?? subject?.assignments} />
      {subject?.assignments === null && <Loader />}

      {role !== 'student' && (
        <Link to={`/classes/${subjectId}/new`} className='sm:hidden fixed bottom-20 flex justify-center right-5 w-12 h-12 bg-red-600 rounded-full hover:bg-red-700 active:shadow-lg shadow transition ease-in duration-200 focus:outline-none'>
          <IconPlus className='w-6 h-6 self-center' />
        </Link>
      )}
    </div>
  )
}
