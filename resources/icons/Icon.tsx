import React, { SVGProps } from 'react'

export type TIcon = SVGProps<SVGSVGElement> & {
  size?: number;
}

export type TToggle = TIcon & {
  toggled: boolean;
}

export const Icon = (props: TIcon) => {
  const { width, height, size, children, ...svgProps } = props
  const sizing = size ? { width: size, height: size } : { width, height }

  return (
    <svg {...sizing} {...svgProps} xmlns='http://www.w3.org/2000/svg'>
      {children}
    </svg>
  )
}
