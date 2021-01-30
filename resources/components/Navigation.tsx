import React, { ComponentProps } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { request, toggleDarkMode } from '../utils'
import { IconLogo, IconDarkMode, IconHome, IconStudents, IconSettings, IconUser, IconFolder, IconLogout } from '../icons'

export const Navigation = () => {
  const { pathname } = useLocation()

  const onLogout = async () => {
    await request('logout', { method: 'post' })
    location.href = '/'
  }

  const DefaultLink = (props: ComponentProps<Link> & { icon?: boolean }) => {
    const { icon, children, ...linkProps } = props
    const current = pathname === linkProps.to ? icon ? ' border-current' : ' text-white bg-gray-900 dark:text-black dark:bg-gray-200' : ''

    return (
      <Link className={`max-sm:hidden border-transparent hover:border-current border-b-1 p-1${current}`} {...linkProps}>
        {children}
      </Link>
    )
  }

  const MobileLink = (props: ComponentProps<Link>) => {
    const { children, ...linkProps } = props
    const current = pathname === linkProps.to ? ' text-white dark:text-black' : ''

    return (
      <Link className={`stack items-center p-2 mt-1 hover:text-white dark:hover:text-black${current}`} {...linkProps}>
        {children}
      </Link>
    )
  }

  return (
    <nav>
      {/* default navigation */}
      <div className='hstack justify-between p-4 shadow dark:shadow-white text-xl font-medium'>
        <div className='hstack items-center space-x-5'>
          <Link to='/' className='hstack items-center'>
            <IconLogo size={32} className='mr-3' />
            <span className='sm:hidden'>Upload System PRO</span>
          </Link>
          <DefaultLink to='/classes'>Classes</DefaultLink>
          <div className='max-sm:hidden h-full border-gray-400 border-l-1' />
          <DefaultLink to='/students'>Students</DefaultLink>
        </div>
        <div className='hstack items-center space-x-5'>
          <IconDarkMode size={24} className='cursor-pointer' onClick={toggleDarkMode} />
          <DefaultLink icon to='/settings'><IconUser size={24} /></DefaultLink>
          <IconLogout size={24} className='cursor-pointer' onClick={onLogout} />
        </div>
      </div>

      {/* mobile mavigation */}
      <div className='sm:hidden hstack w-screen fixed bottom-0 bg-gray-900 dark:bg-white justify-evenly text-gray-600 dark:text-gray-500 text-sm font-medium'>
        <MobileLink to='/'><IconHome size={28} /><span>home</span></MobileLink>
        <MobileLink to='/classes'><IconFolder size={28} /><span>classes</span></MobileLink>
        <MobileLink to='/students'><IconStudents size={28} /><span>students</span></MobileLink>
        <MobileLink to='/settings'><IconSettings size={28} /><span>settings</span></MobileLink>
      </div>
    </nav>
  )
}
