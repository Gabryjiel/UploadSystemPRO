import React, { forwardRef } from 'react'

type Props = {
  name: string;
  time?: boolean;
  datetime?: boolean;
  className?: string;
  label?: string;
  error?: string;
  min?: string;
}

export const InputDate = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, time, datetime, label, error, ...inputProps } = props

  return (
    <div className={`input-date relative${className ? ` ${className}` : ''}`}>
      <input
        type={datetime ? 'datetime-local' : time ? 'time' : 'date'} className='relative mt-4 w-full bg-transparent border-current border-b-1 focus:outline-none'
        ref={ref} {...inputProps}
      />
      <span className='absolute font-medium left-1 text-xs text-gray-400'>{label}</span>
      <span className='absolute font-medium left-1 opacity-0 transition transform ease-in-out duration-200 text-xs bottom-0 text-red-500 translate-y-0'>{error}</span>
    </div>
  )
})
