import React, { forwardRef, HTMLProps } from 'react'

type Props = HTMLProps<HTMLInputElement> & {
  label?: string;
  error?: string;
}

export const InputFile = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, label, error, ...inputProps } = props

  return (
    <div className={`input-file relative${className ? ` ${className}` : ''}`}>
      <input
        className='relative mt-4 w-full bg-transparent border-current border-b-1 focus:outline-none'
        ref={ref} {...inputProps} type='file'
      />
      <span className='absolute font-medium left-1 text-xs text-gray-400'>{label}</span>
      <span className='absolute font-medium left-1 opacity-0 transition transform ease-in-out duration-200 text-xs bottom-0 text-red-500 translate-y-0'>{error}</span>
    </div>
  )
})
