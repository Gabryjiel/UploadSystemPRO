import React, { useState, useEffect, Fragment } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { request } from '../utils'
import { Loader } from './Loader'
import { InputText } from './InputText'
import { TAssignment, TAnswer } from '../typings'
import { IconPlus, IconEdit } from '../icons'

type Props = RouteComponentProps<{ id: string }> & {
  role: number;
}

export const Assignment = (props: Props) => {
  const [assignment, setAssignment] = useState<null | TAssignment>(null)
  const [answers, setAnswers] = useState<null | TAnswer[]>(null)
  const [search, setSearch] = useState<null | TAnswer[]>(null)
  const [query, setQuery] = useState<string>('')

  const assignmentId = props.match.params.id

  useEffect(() => {
    request<TAssignment>(`assignments/${assignmentId}`).then(setAssignment)
    // request<TAnswer[]>(`answers/${assignmentId}`).then(Object.values).then(setAnswers)
  }, [])

  useEffect(() => {
    if (query === '') return setSearch(null)
    const includes = (str: string, substr: string) => str.toLowerCase().indexOf(substr.toLocaleLowerCase()) !== -1

    // const search = assignments ? assignments.filter(({ name }) => includes(name, query)) : null

    // setSearch(search)
  }, [query])

  const getBGColor = (code: string) => {
    const colors = ['yellow', 'green', 'gray', 'red', 'blue', 'indigo', 'purple']

    return `bg-${colors[code.charCodeAt(3) % 7]}-700`
  }

  // const AssignmentTable = (props: { content: TAssignment[] | null }): JSX.Element => {
  //   return (
  //     <div className='grid grid-cols-assignments items-center gap-2 font-medium dark:font-normal'>
  //       {props.content?.map(({ id, name, description, deadline }) => {
  //         const due = ~~((new Date(deadline).getTime() - Date.now()) / 8.64e7)
  //         return (
  //           <Fragment key={id}>
  //             <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(description)} flex items-center justify-center text-3xl sm:text-4xl font-normal text-white`}>{name[0]}</div>
  //             <Link to={`/assignments/${id}`} className='stack self-start ml-1 min-w-0'>
  //               <span className='text-sm sm:text-xl overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{name}</span>
  //               <span className='text-xs font-normal dark:font-light overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{description}</span>
  //             </Link>
  //             <div className='text-center text-xs sm:text-base whitespace-nowrap'>
  //               <span>{due < 0 ? 'ended' : due < 1 ? `${~~(due * 24)} hours` : `${due} days`}</span>
  //               <hr className='w-3 mx-auto border-current' />
  //               <span>{new Date(deadline).toLocaleDateString()}</span>
  //             </div>
  //             <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
  //               <span>7 / 16</span>
  //               <span>answers</span>
  //             </div>
  //             <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
  //               <span>0</span>
  //               <span>new</span>
  //             </div>
  //             <div className='col-span-full border-b-1 border-current' />
  //           </Fragment>
  //         )
  //       })}
  //     </div>
  //   )
  // }

  return (
    <div className='stack'>
      <div className='hstack mb-2 justify-between'>
        <h1 className='text-xl sm:text-2xl px-1 pt-1 mt-1 border-l-1 border-current'>{assignment?.name || ' '}</h1>
        <Link className='self-center p-3 py-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`/assignments/${assignmentId}/settings`}>
          <IconEdit className='w-5' />
        </Link>
      </div>
      <h1 className='sm:text-lg dark:font-light ml-1 overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{assignment?.description}</h1>
      <h1 className='text-sm sm:text-base dark:font-light italic ml-1'>deadline: {assignment?.deadline && new Date(assignment?.deadline).toLocaleString()}</h1>
      <h1 className='text-sm sm:text-base dark:font-light italic ml-1 mb-5'>reference materials: {'none'}</h1>
      <div className='hstack justify-between mb-10'>
        <h1 className='text-lg sm:text-xl px-2 border-b-1 border-current'>answers</h1>
        <div className='min-w-0 my-auto w-44 md:w-52'>
          <InputText
            variant='outlined' placeholder='search' name='search' onChange={ ({ currentTarget: { value } }) => setQuery(value) }
            label='search' className='text-md' value={query} onClose={() => setQuery('')}
          />
         </div>
      </div>

      {/* <AssignmentTable content={search ?? assignments} /> */}
      {/* {assignments === null && <Loader />} */}
    </div>
  )
}
