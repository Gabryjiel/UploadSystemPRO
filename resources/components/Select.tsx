import React, { forwardRef, HTMLProps } from 'react'

type Props = HTMLProps<HTMLSelectElement> & {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const { className, placeholder, error, children, ...selectProps } = props

  return (
    <div className={`select relative${className ? ` ${className}` : ''}`}>
      <select className='w-full border-b-1 border-current bg-gray-200 dark:bg-gray-900 p-2' ref={ref} {...selectProps}>
        <option hidden value=''>{placeholder}</option>
        {children}
      </select>
      <span className='absolute font-medium left-1 opacity-0 transition transform ease-in-out duration-200 text-xs bottom-0 text-red-500 translate-y-0'>{error}</span>
    </div>
  )
})
