import React from 'react'

type Props = {
  className?: string;
  value?: string;
}

export const ButtonSubmit = (props: Props) => {
  const { className, ...buttonProps } = props

  return (
    <input type='submit' className={`button-submit${className ? ` ${className}` : ''}`} {...buttonProps} />
  )
}
