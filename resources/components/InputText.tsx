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
    <div className={`input-text relative mb-4 ${className ? ` ${className}` : ''}`}>
      <input
        className='appearance-none w-full px-1 pt-4 pb-2 border-b-1 bg-transparent border-gray-400 focus:outline-none'
        autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false' {...inputProps} ref={ref}
      />
      <span className='popup-message text-gray-400 translate-y-2'>{label}</span>
      <span className='popup-message bottom-0 text-red-500 translate-y-0'>{error}</span>
    </div>
  )
})
