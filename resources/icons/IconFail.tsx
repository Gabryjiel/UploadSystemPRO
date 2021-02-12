import React from 'react'
import { Icon, TIcon } from './Icon'

export const IconFail = (props: TIcon) => {
  return (
    <Icon viewBox='0 0 32 32' fill='currentColor' {...props}>
      <path d='m16,2a14,14 0 1 0 14,14a14,14 0 0 0 -14,-14zm0,26a12,12 0 1 1 12,-12a12,12 0 0 1 -12,12z' />
      <polygon points='19.54 11.05 16 14.59 12.46 11.05 11.05 12.46 14.59 16 11.05 19.54 12.46 20.95 16 17.41 19.54 20.95 20.95 19.54 17.41 16 20.95 12.46 19.54 11.05' />
    </Icon>
  )
}
