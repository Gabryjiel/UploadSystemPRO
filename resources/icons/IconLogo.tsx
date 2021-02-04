import React from 'react'
import { Icon, TIcon } from './Icon'

export const IconLogo = (props: TIcon) => {
  return (
    <Icon viewBox='0 0 66 66' {...props}>
      <defs>
        <mask id='logo'>
          <circle fill='white' cx='33' cy='33' r='33' mask='url(#arrow)' />
          <g fill='none' stroke='black' strokeLinecap='round' strokeWidth='2px'>
            <line strokeMiterlimit='10' x1='33' x2='33' y1='41' y2='18' />
            <path strokeMiterlimit='10' d='M24.27,26.73l8.6-8.67a0.18,0.18,0,0,1,.26,0l8.6,8.67' />
            <path strokeLinejoin='round' d='M49,38v6.18A5.82,5.82,0,0,1,43.18,50H22.82A5.82,5.82,0,0,1,17,44.18V38' />
          </g>
        </mask>
      </defs>
      <rect fill='currentColor' width='66' height='66' mask='url(#logo)' />
    </Icon>
  )
}
