import React, { forwardRef, HTMLProps } from 'react'
import { IconClose } from '../icons'

type Props = HTMLProps<HTMLInputElement> & {
  variant: 'underlined' | 'outlined'
  onClose?: () => void
  label?: string;
  error?: string;
}

export const InputText = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { variant, onClose, className, label, error, ...inputProps } = props

  const closeButton = onClose && <IconClose className='w-5 mr-1 transition transform rotate-0 cursor-pointer select-none' onClick={onClose} />

  return variant === 'underlined' ? (
    <div className={`input-text${onClose ? ' input-text-clear' : ''} relative hstack border-b-1 border-gray-400${className ? ` ${className}` : ''}`}>
      <input
        className='appearance-none w-full px-1 pt-4 pb-2 bg-transparent focus:outline-none'
        autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false' {...inputProps} ref={ref}
      />
      <span className='absolute font-medium left-1 opacity-0 transition transform ease-in-out duration-200 text-xs text-gray-400 translate-y-2'>{label}</span>
      <span className='absolute font-medium left-1 opacity-0 transition transform ease-in-out duration-200 text-xs bottom-0 text-red-500 translate-y-0'>{error}</span>
      {closeButton}
    </div>
  ) : (
    <div className={`${onClose ? 'input-text-clear ' : ''}hstack items-center p-1 relative border-1 border-current${className ? ` ${className}` : ''}`}>
      <input
        className='appearance-none px-1 bg-transparent focus:outline-none w-full'
        autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false' {...inputProps} ref={ref}
      />
      {closeButton}
    </div>
  )
})
