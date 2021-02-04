import React, { SVGProps } from 'react'

export type TIcon = SVGProps<SVGSVGElement>

export const Icon = (props: TIcon) => {
  const { children, ...svgProps } = props

  return (
    <svg {...svgProps} xmlns='http://www.w3.org/2000/svg'>
      {children}
    </svg>
  )
}
