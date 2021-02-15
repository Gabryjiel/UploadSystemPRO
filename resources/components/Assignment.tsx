import React, { useState, useEffect, useContext, Fragment } from 'react'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { request, RoleContext, getBGColor } from '../utils'
import { Loader } from './Loader'
import { InputText } from './InputText'
import { TAssignment, TAnswer, TFile } from '../typings'
import { IconArrow, IconEdit, IconPaperclip, IconStar } from '../icons'
import { Feedback } from './Feedback'

type Props = RouteComponentProps<{ assignmentId: string }>

type TResponse = TAssignment & {
  answers: TAnswer[];
}

export const Assignment = (props: Props) => {
  const history = useHistory()
  const role = useContext(RoleContext)
  const [assignment, setAssignment] = useState<TAssignment | null | undefined>(null)
  const [search, setSearch] = useState<null | TAnswer[]>(null)
  const [query, setQuery] = useState<string>('')
  const [forms, setForms] = useState<number[]>([])

  const { assignmentId } = props.match.params

  useEffect(() => {
    request<TResponse>(`assignments/${assignmentId}`)
      .then((data) => assignment === null && setAssignment(data))
      // .catch(({ code }) => code === 404 && history.push(`/classes/${assignment.classId}`))

    return () => setAssignment(void 0)
  }, [])

  useEffect(() => {
    if (query === '') return setSearch(null)
    const includes = (str: string, substr: string) => str.toLowerCase().indexOf(substr.toLocaleLowerCase()) !== -1

    const search = assignment?.answers ? assignment?.answers.filter(({ user }) => includes(user.name, query)) : null

    setSearch(search)
  }, [query])

  const downloadFile = async (file: TFile) => {
    const blob = await fetch(`files/${file.id}`).then((res) => res.blob())
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.setAttribute('download', file.name)
    a.click()
  }


  const AnswersTable = (props: { content?: TAnswer[] }): JSX.Element => {
    return (
      <div className='grid grid-cols-answers items-center gap-2 font-medium dark:font-normal'>
        {props.content?.map(({ id, user, timestamp, description, files, feedback }) => {
          const acr = user.name.split(' ').map((name) => name[0]).slice(0, 2).join(' ')
          const [name, ...restName] = user.name.split(' ')
          const sent = (Date.now() - new Date(timestamp).getTime()) / 8.64e7
          const shown = forms.indexOf(id) !== -1
          const toggle = () => setForms(shown ? forms.filter((i) => i !== id) : [...forms, id])

          return (
            <Fragment key={id}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(description.charCodeAt(2) % 7)} flex items-center justify-center text-2xl sm:text-3xl font-normal text-white tracking-tighter`}>{acr}</div>
              <div className='stack self-start ml-1 min-w-0 cursor-pointer' onClick={toggle}>
                <span className='text-sm sm:text-xl overflow-hidden overflow-ellipsis box orient-vertical clamp-1'>{name}</span>
                <span className='text-sm sm:text-xl overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{restName.join(' ')}</span>
              </div>
              <div className='text-center text-xs sm:text-base whitespace-nowrap'>
              <span>{sent < 1 ? `${~~(sent * 24)} hour${~~(sent * 24) !== 1 ? 's' : ''}` : `${~~sent} day${~~sent !== 1 ? 's' : ''}`} ago</span>
                <hr className='w-3 mx-auto border-current' />
                <span>{new Date(timestamp).toLocaleDateString()}</span>
              </div>
              <div className='hstack justify-center space-x-4'>
                {files[0] && (
                  <IconPaperclip className='h-6 cursor-pointer' onClick={() => downloadFile(files[0])} />
                )}
                <IconStar className={`w-6 cursor-pointer${feedback ? ' hidden' : ''}`} onClick={toggle} />
              </div>
              <div className={`cursor-pointer transform rotate-0 transition-transform${shown ? ' rotate-90' : ''}`} onClick={toggle}>
                <IconArrow className='w-6' />
              </div>
              {shown && <Feedback description={description} answerId={id} />}
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
        <h1 className='text-xl sm:text-2xl px-1 pt-1 mt-1 border-l-1 border-current'>{assignment?.name || ' '}</h1>
        <Link className='self-center p-3 py-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`${assignmentId}/settings`}>
          <IconEdit className='w-5' />
        </Link>
      </div>
      <h1 className='sm:text-lg dark:font-light ml-1 overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{assignment?.description}</h1>
      <h1 className='text-sm sm:text-base dark:font-light italic ml-1'>deadline: {assignment?.deadline && new Date(assignment?.deadline).toLocaleString()}</h1>
      <h1 className='text-sm sm:text-base dark:font-light italic ml-1 mb-5 hstack items-center'>
        <span>reference materials: </span>
        <ul className='hstack mx-2 not-italic font-medium flex-wrap'>
          {assignment && assignment.files.length < 1 ? <li>{'none'}</li> : assignment?.files.map(({ id, name }) => (
            <li className='flex' key={id}>
              <Link target='_blank' to={`/api/files/${id}`} className='px-2 mx-2 my-1 py-1 border-current border-1'>{name}</Link>
            </li>)
          )}
        </ul>
      </h1>
      <div className='hstack justify-between mb-10'>
        <h1 className='text-lg sm:text-xl px-2 border-b-1 border-current'>answers</h1>
        <div className='min-w-0 my-auto w-44 md:w-52'>
          <InputText
            variant='outlined' placeholder='search' name='search' onChange={ ({ currentTarget: { value } }) => setQuery(value) }
            label='search' className='text-md' value={query} onClose={() => setQuery('')}
          />
         </div>
      </div>

      {AnswersTable({ content: search ?? assignment?.answers })}
      {assignment?.answers === null && <Loader />}
    </div>
  )
}
