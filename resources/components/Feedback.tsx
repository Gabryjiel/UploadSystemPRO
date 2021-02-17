import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { request } from '../utils'
import { Message, TMessage } from './Message'
import { TextArea } from './TextArea'

type Props = {
  feedbackId: number | null;
  answerId: number;
  description: string;
}

type Form = {
  answer_id: number;
  description: string;
}

export const Feedback = (props: Props) => {
  const { answerId, description } = props
  const { errors, register, handleSubmit, formState, watch } = useForm<Form>({ reValidateMode: 'onSubmit' })
  const [feedbackId, setFeedbackId] = useState<number | null>(props.feedbackId)
  const [message, setMessage] = useState<TMessage>({ text: '' })
  const reply = watch('description')

  const onSubmit = (payload: Form) => {
    return request(reply === '' ? `feedbacks/${feedbackId}` : 'feedbacks', { method: reply === '' ? 'delete' : 'post', body: JSON.stringify(payload) })
      .then(() => {
        if (reply === '') setFeedbackId(null)
        setMessage({ text: `You have successfully ${reply === '' ? 'deleted' : 'given'} a feedback`, variant: 'success' })
      })
      .catch(() => setMessage({ text: 'Something bad has happened. Please try again later', variant: 'error' }))
  }

  return (
    <div className='col-span-full stack mb-1'>
      <div className='pt-1 pb-1 sm:pb-2 border-b-1 border-gray-500 text-xs sm:text-sm'>
        <span className='px-1 border-l-1 border-current'>description: </span>
        {description}
      </div>
      <form className='hstack mt-1 sm:mt-2' noValidate onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='answer_id' value={answerId} ref={register()} />
        <TextArea
          className='flex w-full mr-4' label='your response' name='description' error={errors.description?.message}
          ref={register({ ...!feedbackId && { required: { value: true, message: 'Please give a review of the answer' } } })}
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
