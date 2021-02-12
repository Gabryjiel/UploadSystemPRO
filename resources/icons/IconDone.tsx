import React from 'react'
import { Icon, TIcon } from './Icon'

export const IconDone = (props: TIcon) => {
  return (
    <Icon viewBox='0 0 32 32' fill='currentColor' {...props}>
      <path d='m16,2a14,14 0 1 0 14,14a14,14 0 0 0 -14,-14zm0,26a12,12 0 1 1 12,-12a12,12 0 0 1 -12,12z' />
      <path d='m13.38,19.59l-3.29,-3.3l-1.42,1.42l3.33,3.29a2,2 0 0 0 1.42,0.58a2,2 0 0 0 1.37,-0.58l8.54,-8.54l-1.42,-1.41l-8.53,8.54z' />
    </Icon>
  )
}
