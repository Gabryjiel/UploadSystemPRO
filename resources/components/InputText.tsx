import React, { forwardRef } from 'react'

type Props = {
  className?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  label?: string;
  error?: string;
}

export const InputText = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, label, error, ...inputProps } = props
  return (
    <div className={`input-text${className ? ` ${className}` : ''}`}>
      <input autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false' {...inputProps} ref={ref} />
      <span className='label'>{label}</span>
      <span className='error'>{error}</span>
    </div>
  )
})
