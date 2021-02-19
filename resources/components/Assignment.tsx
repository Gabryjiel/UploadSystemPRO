import React, { useState, useEffect, useContext, Fragment } from 'react'
import { Link, Redirect, RouteComponentProps, useHistory } from 'react-router-dom'
import { request, RoleContext, getBGColor, downloadFile } from '../utils'
import { Loader } from './Loader'
import { InputText } from './InputText'
import { TAssignment, TAnswer, TFeedback } from '../typings'
import { IconArrow, IconEdit, IconPaperclip, IconStar } from '../icons'
import { Feedback } from './Feedback'
import { TextArea } from './TextArea'
import { InputFile } from './InputFile'
import { useForm } from 'react-hook-form'
import { Message, TMessage } from './Message'

type Props = RouteComponentProps<{
  subjectId: string;
  assignmentId: string;
}>

type TResponse = TAssignment & {
  answers: TAnswer[];
}

type Form = {
  description: string;
  files: FileList | null;
}

export const NoAssignmentId = (props: Props) => {
  const { subjectId } = props.match.params
  return <Redirect to={`../${subjectId}`} />
}

export const Assignment = (props: Props) => {
  const history = useHistory()
  const role = useContext(RoleContext)
  const [assignment, setAssignment] = useState<TAssignment | null | undefined>(null)
  const [search, setSearch] = useState<null | TAnswer[]>(null)
  const [query, setQuery] = useState<string>('')
  const [forms, setForms] = useState<number[]>([])

  const [message, setMessage] = useState<TMessage>({ text: '' })
  const [answer, setAnswer] = useState<TAnswer | null | undefined>(null)
  const [feedback, setFeedback] = useState<TFeedback | null | undefined>(null)
  const { errors, register, handleSubmit, reset, formState, setValue } = useForm<Form>({ reValidateMode: 'onSubmit' })

  const { subjectId, assignmentId } = props.match.params

  useEffect(() => {
    request<TResponse>(`assignments/${assignmentId}`)
      .then((data) => assignment === null && setAssignment(data))
      .catch(({ code }) => code === 404 && history.push(`/classes/${subjectId}`))

    return () => setAssignment(void 0)
  }, [])

  useEffect(() => role === 'student' ? (() => {
    if (!assignment || !assignment.answers.length) return
    request<TAnswer>(`answers/${assignment.answers[0].id}`).then((data) => answer === null && setAnswer(data))

    return () => setAnswer(void 0)
  })() : void 0, [assignment])

  useEffect(() => role === 'student' ? (() => {
    if (!answer) return

    setValue('description', answer.description)

    if (answer.feedback) {
      request<TFeedback>(`feedbacks/${answer.feedback}`).then(setFeedback)
    }
  })() : void 0, [answer])

  useEffect(() => {
    if (query === '') return setSearch(null)
    const includes = (str: string, substr: string) => str.toLowerCase().indexOf(substr.toLocaleLowerCase()) !== -1

    const search = assignment?.answers ? assignment?.answers.filter(({ user }) => includes(user.name, query)) : null

    setSearch(search)
  }, [query])

  const onSubmit = async (payload: Form) => {
    if (!payload.description && !payload.files?.length) return setMessage({ variant: 'error', text: 'Your work is empty'} )

    const body = new FormData()
    body.append('assignment_id', `${assignment?.id}`)
    body.append('description', payload.description)
    Array.from(payload.files || []).forEach((f) => body.append('files[]', f))

    if (answer) {
      return request<TAnswer>(`answers/${answer.id}`, { method: 'post', body }).then((answer) => {
        setAnswer(answer)
        setMessage({ variant: 'success', text: 'You have successfully updated your work!'} )
      }).catch(() => setMessage({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
    }

    return request<TAnswer>('answers', { method: 'post', body }).then((answer) => {
      setAnswer(answer)
      setMessage({ variant: 'success', text: 'You have successfully submitted your work!'} )
    }).catch(() => setMessage({ variant: 'error', text: 'An error has occurred. Please try again later'} ))
  }

  const validateDescription = (input: string) => {
    if (input.indexOf('\\') !== -1) return 'Description contains a forbidden character!'
  }

  const validateWork = (input: FileList) => {
    if (input.length > 5) return 'You can only attach up to 5 file per assignment'
    if (Array.from(input).reduce((c, a) => c + a.size, 0) > 67108864) return 'Sorry, but the payload is too big (max 64MB)'
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
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(description.charCodeAt(2) % 7)} flex items-center justify-center text-xl sm:text-3xl font-normal text-white tracking-tighter`}>{acr}</div>
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
              {shown && <Feedback assignment={assignment} setAssignment={setAssignment} feedbackId={feedback} description={description} answerId={id} />}
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
        {role !== 'student' && (
          <Link className='self-center p-3 py-2 hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200' to={`${assignmentId}/settings`}>
            <IconEdit className='w-5' />
          </Link>
        )}
      </div>
      <h2 className='sm:text-lg dark:font-light ml-1 overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>{assignment?.description}</h2>
      <h2 className='text-sm sm:text-base dark:font-light italic ml-1'>deadline: {assignment?.deadline && new Date(assignment?.deadline).toLocaleString()}</h2>
      <h2 className='text-sm sm:text-base dark:font-light italic ml-1 mb-5 hstack items-center'>
        <span>reference materials: </span>
        <ul className='hstack mx-2 not-italic font-medium flex-wrap'>
          {assignment && assignment.files.length < 1 ? <li>{'none'}</li> : assignment?.files.map((file) => (
            <li className='flex px-2 mx-2 my-1 py-1 border-current border-1 cursor-pointer' key={file.id} onClick={() => downloadFile(file)}>{file.name}</li>)
          )}
        </ul>
      </h2>

      {role !== 'student' && (<>
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
      </>)}

      {role == 'student' && (<>
        <div className='grid gap-10 xl:grid-cols-2'>
          <form
            noValidate onSubmit={handleSubmit(onSubmit)}
            className={`${new Date(assignment?.deadline || 0).getTime() < Date.now() ? 'opacity-20 pointer-events-none' : ''} ${!answer ? 'col-span-full' : ''}`}
          >
            <TextArea
              name='description' className='col-span-full' label='your comment' rows={5} maxLength={2048}
              ref={register({ validate: validateDescription })} error={errors.description?.message}
            />
            <div className='hstack'>
              <InputFile
                name='files' label='your work' className='w-full mr-10'
                ref={register({ validate: validateWork })} error={errors.files?.message} multiple
              />
              <input type='submit' value='submit' disabled={formState.isSubmitting}
                className={`col-auto ml-auto mt-2 px-10 border-current border-1 py-1 cursor-pointer bg-transparent \
hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none`} />
            </div>
            {answer?.files.length ? (
              <h1 className='text-xs sm:text-sm dark:font-light ml-1 mt-5 hstack items-center'>
                <span>submitted materials: </span>
                <ul className='hstack mx-2 font-medium flex-wrap'>
                  {answer.files.map((file) => (
                    <li className='flex px-2 mx-2 my-1 py-1 border-current border-1 cursor-pointer' key={file.id} onClick={() => downloadFile(file)}>{file.name}</li>)
                  )}
                </ul>
              </h1>
            ) : null}
            <Message ctx={message} className='col-span-full' onClose={() => setMessage({ text: '' })} />
          </form>

          {answer && (
            <div className='stack'>
              <h1 className='text-lg sm:text-xl px-2 border-b-1 border-current mr-auto mb-2'>feedback</h1>
              <span>{feedback?.description || 'no feedback yet'}</span>
            </div>
          )}
        </div>
      </>)}
    </div>
  )
}
