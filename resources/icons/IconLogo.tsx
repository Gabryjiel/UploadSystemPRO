import React from 'react'
import { Icon, TIcon } from './Icon'

export const IconLogo = (props: TIcon) => {
  return (
    <Icon viewBox='0 0 66 66' {...props}>
      <path d='M1,34A32,32,0,1,0,33,2,32,32,0,0,0,1,34Z'/>
      <g  fill='none' stroke='white' strokeLinecap='round' strokeWidth='2px'>
        <line className='cls-1' strokeMiterlimit='10' x1='33' x2='33' y1='41' y2='18' />
        <path className='cls-1' strokeMiterlimit='10' d='M24.27,26.73l8.6-8.67a0.18,0.18,0,0,1,.26,0l8.6,8.67' />
        <path className='cls-2' strokeLinejoin='round' d='M49,38v6.18A5.82,5.82,0,0,1,43.18,50H22.82A5.82,5.82,0,0,1,17,44.18V38' />
      </g>
    </Icon>
  )
}
