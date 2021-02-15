import React from 'react'
import { Icon, TIcon } from './Icon'

export const IconArrow = (props: TIcon) => {
  return (
    <Icon viewBox='0 0 32 32' fill='currentColor' {...props}>
      <path d='m16,31a15,15 0 1 1 15,-15a15,15 0 0 1 -15,15zm0,-28a13,13 0 1 0 13,13a13,13 0 0 0 -13,-13z' />
      <path d='m12.6,22.8l-1.2,-1.6l6.93,-5.2l-6.93,-5.2l1.2,-1.6l8,6a1,1 0 0 1 0,1.6l-8,6z' />
    </Icon>
  )
}
