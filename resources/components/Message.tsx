import React from 'react'

type Props = {
  ctx: TMessage;
  onClose?: () => void;
}

export type TMessage = {
  text: string;
  variant?: 'error' | 'success';
}

const getVariant = (ctx: TMessage) => {
  return ctx.variant === 'success' ? 'text-green-600 border-green-700' :
    ctx.variant === 'error' ? 'text-red-500 border-red-600' : 'text-black border-black'
}

export const Message = (props: Props) => {
  const { ctx, onClose } = props

  return ctx.text ? (
    <div className={`hstack justify-between items-center mt-2 text-sm p-2 px-4 border rounded ${getVariant(ctx)}`}>
      <span>{ctx.text}</span>
      <svg
        className='cursor-pointer' width='12px' height='12px' onClick={onClose}
        fill='currentColor' strokeWidth='0' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'
      >
        <path fillRule='evenodd' d='M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z' />
      </svg>
    </div>
  ) : null
}
