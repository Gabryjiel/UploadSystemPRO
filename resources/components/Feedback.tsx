import React, { Dispatch, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TAssignment, TFeedback } from '../typings'
import { request } from '../utils'
import { Message, TMessage } from './Message'
import { TextArea } from './TextArea'

type Props = {
  feedbackId: number | null;
  answerId: number;
  description: string;
  assignment: TAssignment | null | undefined;
  setAssignment: Dispatch<React.SetStateAction<TAssignment | null | undefined>>;
}

type Form = {
  answer_id: number;
  description: string;
}

export const Feedback = (props: Props) => {
  const { answerId, description, feedbackId, assignment, setAssignment } = props
  const { errors, register, handleSubmit, formState, watch, setValue } = useForm<Form>({ reValidateMode: 'onSubmit' })
  const [message, setMessage] = useState<TMessage>({ text: '' })
  const reply = watch('description')

  useEffect(() => {
    feedbackId && request<TFeedback>(`feedbacks/${feedbackId}`).then(({ description }) => setValue('description', description))
  }, [])

  const updateFeedbackId = (id: number | null) => {
    if (!assignment) return

    const answers = assignment.answers.map((ans) => ans.id === answerId ? { ...ans, feedback: id } : ans)
    setAssignment({ ...assignment, answers })
  }

  const onSubmit = (payload: Form) => {
    if (reply === '') {
      return request<void>(`feedbacks/${feedbackId}`, { method: 'delete' }).then(() => {
        updateFeedbackId(null)
        setMessage({ text: `You have successfully deleted a feedback`, variant: 'success' })
      }).catch(() => setMessage({ text: 'Something bad has happened. Please try again later', variant: 'error' }))
    }

    if (feedbackId) {
      return request<void>(`feedbacks/${feedbackId}`, { method: 'PATCH', body: JSON.stringify(payload) }).then(() => {
        setMessage({ text: `You have successfully updated a feedback`, variant: 'success' })
      }).catch(() => setMessage({ text: 'Something bad has happened. Please try again later', variant: 'error' }))
    }

    return request<TFeedback>('feedbacks', { method: 'post', body: JSON.stringify(payload) }).then(({ id }) => {
      updateFeedbackId(id)
      setMessage({ text: 'You have successfully given a feedback', variant: 'success' })
    }).catch(() => setMessage({ text: 'Something bad has happened. Please try again later', variant: 'error' }))
  }

  const validateDescription = (input: string) => {
    if (feedbackId) return
    if (input === '') return 'Please give a review of the answer'
    if (input.indexOf('\\') !== -1) return 'Your review contains a forbidden character!'
  }

  return (
    <div className='col-span-full stack mb-1'>
      <div className='pt-1 pb-1 sm:pb-2 border-b-1 border-gray-500 text-xs sm:text-sm'>
        <span className='px-1 border-l-1 border-current'>description: </span>
        {description}
      </div>
      <form className={`hstack mt-1 sm:mt-2${feedbackId && reply === void 0 ? ' opacity-20 pointer-events-none' : ''}`} noValidate onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='answer_id' value={answerId} ref={register()} />

        <TextArea
          className='flex w-full mr-4' label='your response' name='description' error={errors.description?.message}
          ref={register({ validate: validateDescription })}
        />

        <input
          type='submit' value={feedbackId && reply === '' ? 'delete' : 'reply'} disabled={formState.isSubmitting || message.variant === 'success'}
          className={`mt-auto mb-1 border-current border-1 py-1 cursor-pointer bg-transparent text-sm sm:text-base hover:text-white dark:hover:text-black w-20 sm:w-32 \
hover:bg-gray-900 dark:hover:bg-gray-200 focus:outline-none disabled:opacity-20 disabled:pointer-events-none${feedbackId && reply === '' ? ' text-red-500 hover:bg-red-500' : ''}`}
        />
      </form>
      <Message ctx={message} className='mb-4' onClose={() => setMessage({ text: '' })} />
    </div>
  )
}
