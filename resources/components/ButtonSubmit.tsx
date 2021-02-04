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
      className={`button-submit dark:bg-transparent dark:text-black${className ? ` ${className}` : ''}`}
      type='submit' disabled={isSubmitting} {...buttonProps}
    />
  )
}
