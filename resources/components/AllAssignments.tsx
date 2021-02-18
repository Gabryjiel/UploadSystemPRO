import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconStar } from '../icons'
import { TAssignment } from '../typings'
import { getBGColor, request, RoleContext } from '../utils'
import { Loader } from './Loader'

export const AllAssignments = () => {
  const role = useContext(RoleContext)
  const [assignments, setAssignments] = useState<TAssignment[] | null | undefined>(null)

  useEffect(() => {
    request<TAssignment[]>('assignments?sort=deadline').then((data) => assignments === null && setAssignments(data))

    return () => setAssignments(void 0)
  }, [])

  const AssignmentTable = (props: { content?: TAssignment[] | null }): JSX.Element => {
    return (
      <div className='grid grid-cols-assignments items-center gap-2 font-medium dark:font-normal'>
        {props.content?.map(({ id, name, description, deadline, answers, subject_id }) => {
          return (
            <Fragment key={id}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(description.charCodeAt(3) % 7)} flex items-center justify-center text-3xl sm:text-4xl font-normal text-white`}>{name[0]}</div>
              <Link to={`/classes/${subject_id}/assignments/${id}`} className='stack self-start ml-1 min-w-0'>
                <span className='text-sm sm:text-xl overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{name}</span>
                <span className='text-xs font-normal dark:font-light overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{description}</span>
              </Link>
              <div className={`text-center text-xs sm:text-base whitespace-nowrap${role === 'student' ? ' col-start-3 col-end-5' : ''}`}>
                <span>{new Date(deadline).toLocaleDateString()}</span>
              </div>
              {role !== 'student' && (
                <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
                  <span>{answers.length}</span>
                  <span>answers</span>
                </div>
              )}
              <div className='stack text-center text-xs sm:text-base whitespace-nowrap'>
                {(role === 'student' ? answers.length < 1 : answers.some(({ feedback }) => !feedback)) && <IconStar className='w-4 sm:w-6' />}
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
        <h1 className='text-xl sm:text-2xl px-1 pt-1 mt-1 border-l-1 border-current'>All Assignments</h1>
      </div>
      <h1 className='sm:text-lg font-light ml-1 mb-5 overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>List of all assignments available to you</h1>
      <div className='hstack justify-between mb-10'>
        <h1 className='text-lg sm:text-xl px-2 border-b-1 border-current'>assignments</h1>
      </div>

      <AssignmentTable content={assignments} />
      {assignments === null && <Loader />}
    </div>
  )
}