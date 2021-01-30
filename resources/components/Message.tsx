import React from 'react'
import { IconClose } from '../icons'

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
      <IconClose className='w-3 cursor-pointer' onClick={onClose} />
    </div>
  ) : null
}
