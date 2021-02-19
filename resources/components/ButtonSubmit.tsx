import React from 'react'

type Props = {
  className?: string;
  value?: string;
  isSubmitting?: boolean;
}

export const ButtonSubmit = (props: Props) => {
  const { className, isSubmitting, ...buttonProps } = props

  return (
    <input
      type='submit' disabled={isSubmitting} {...buttonProps}
      className={`cursor-pointer bg-black text-white border border-black font-bold text-lg p-2 \
hover:text-black hover:bg-gray-100 focus:outline-none disabled:cursor-default disabled:opacity-30 \
disabled:text-black disabled:bg-gray-100 dark:bg-transparent dark:text-black${className ? ` ${className}` : ''}`}
    />
  )
}
