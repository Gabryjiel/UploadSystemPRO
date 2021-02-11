import React, { HTMLProps } from 'react'
import { Link, useLocation } from 'react-router-dom'

type Props = HTMLProps<HTMLUListElement>

export const Breadcrumbs = (props: Props) => {
  const { className, ...ulProps } = props

  const { pathname } = useLocation()
  const path = pathname.split('/').filter((p) => p)

  const item = (name: string, i: number) => (
    <li key={`${i}-${name}`}>
      <span className='mx-0.5'>/</span>
      <Link to={`/${path.slice(0, i + 1).join('/')}`} className='px-1'>{name}</Link>
    </li>
  )

  return (
    <ul className={`flex flex-row w-max text-sm p-2 bg-gray-500 bg-opacity-20${className ? ` ${className}` : ''}`} {...ulProps}>
      <li><Link to='/' className='px-1'>home</Link></li>
      {path.map(item)}
    </ul>
  )
}
