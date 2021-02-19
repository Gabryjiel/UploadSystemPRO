import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconStar } from '../icons'
import { TAdminStats, TAssignmentProps, TUserStats } from '../typings'
import { getBGColor, request, RoleContext } from '../utils'

type StatsProps = {
  label: string;
  stats?: TAdminStats & TUserStats | null;
}

type AssignmentsProps = {
  role: string;
}

const Stats = (props: StatsProps) => {
  const { label, stats } = props

  return (
    <fieldset className='border-current border-1 px-2 py-4 mb-5 mr-2 flex-grow sm:flex-grow-0'>
      <legend className='bg-gray-900 text-gray-200 dark:bg-gray-200 dark:text-black px-2 py-1 dark:font-medium'>{label}</legend>
      <ul className='hstack justify-around'>
        {Object.entries(stats || []).filter(([k]) => k !== 'user_id').map(([k, v]) => (
          <li key={k} className='stack items-center'>
            <span className='text-xl sm:text-2xl'>{v}</span>
            <span className='border-current border-b-1'>{k}</span>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}

const Assignments = (props: AssignmentsProps) => {
  const { role } = props
  const [assignments, setAssignments] = useState<TAssignmentProps[] | null | undefined>(null)

  useEffect(() => {
    request<TAssignmentProps[]>('assignments?sort=deadline&amount=5').then((data) => assignments === null && setAssignments(data))

    return () => setAssignments(void 0)
  }, [])

  return (
    <fieldset className='border-current border-1 px-2 py-4 mb-5 mr-2 flex-grow sm:flex-grow-0'>
      <legend className='bg-gray-900 text-gray-200 dark:bg-gray-200 dark:text-black px-2 py-1 dark:font-medium'>{'important assignments'}</legend>
      <ul className='grid grid-cols-assignments items-center gap-2 font-medium dark:font-normal'>
        {assignments?.map(({ id, name, description, deadline, answers, ends_in, subject_id, students, not_graded }) => (<Fragment key={id}>
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(description.charCodeAt(3) % 7)} flex items-center justify-center text-3xl sm:text-4xl font-normal text-white`}>{name[0]}</div>
              <Link to={`/classes/${subject_id}/assignments/${id}`} className='stack self-start ml-1 min-w-0'>
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
        </Fragment>))}
      </ul>
    </fieldset>
  )
}

export const Board = () => {
  const role = useContext(RoleContext)
  const [stats, setStats] = useState<TAdminStats & TUserStats | null | undefined>(null)

  useEffect(() => {
    request<TAdminStats & TUserStats>('dashboard').then((data) => stats === null && setStats(data))

    return () => setStats(void 0)
  }, [])

  return (
    <div>
      <h1 className='text-2xl sm:text-3xl px-1 pb-2 mt-1 mb-2 border-l-1 border-current select-none'>dashboard</h1>
      <h2 className='sm:text-lg font-light ml-1 mb-5'>{`Hello, {name}. Here you can check out some of the statistics`}</h2>

      <Stats label='statistics' stats={stats} />
      {role !== 'admin' && <Assignments role={role} />}
    </div>
  )

}
