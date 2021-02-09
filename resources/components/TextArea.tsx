import React, { forwardRef } from 'react'

type Props = {
  name: string;
  className?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { className, placeholder, label, error, ...textareaProps } = props

  return (
    <div className={`textarea relative${className ? ` ${className}` : ''}`}>
      <textarea
        className='bg-transparent focus:outline-none border-gray-400 border-1 p-1 mt-4 w-full' placeholder={placeholder || label}
        autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false' ref={ref} {...textareaProps}
      />
      <span className='absolute font-medium left-1 opacity-0 transition transform ease-in-out duration-200 text-xs text-gray-400 translate-y-2'>{label || placeholder}</span>
      <span className='absolute font-medium left-1 opacity-0 transition transform ease-in-out duration-200 text-xs bottom-0 text-red-500 translate-y-0'>{error}</span>
    </div>
  )
})
