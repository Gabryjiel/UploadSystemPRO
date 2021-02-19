import React, { forwardRef, HTMLProps } from 'react'

type Props = HTMLProps<HTMLInputElement> & {
  boxClassName?: string;
  label?: string;
}

export const InputCheckbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { boxClassName, className, label, ...inputProps } = props

  return (
    <label className={`hstack items-center${className ? ` ${className}` : ''}`}>
      <input className={`mr-2 cursor-pointer${boxClassName ? ` ${boxClassName}` : ''}`} ref={ref} {...inputProps} type='checkbox' />
      {label}
    </label>
  )
})
