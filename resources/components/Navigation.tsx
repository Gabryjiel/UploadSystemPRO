import React, { ComponentProps } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { request } from '../utils'
import { IconLogo, ToggleDarkMode, IconHome, IconStudents, IconSettings, IconUser, IconFolder, IconLogout } from '../icons'

export const Navigation = () => {
  const { pathname } = useLocation()

  const onLogout = async () => {
    await request('logout', { method: 'post' })
    location.href = '/'
  }

  const DefaultLink = (props: ComponentProps<Link>) => {
    const { children, ...linkProps } = props
    const current = pathname === linkProps.to ? ' text-white bg-gray-900' : ''

    return (
      <Link className={`max-sm:hidden p-1${current}`} {...linkProps}>
        {children}
      </Link>
    )
  }

  const MobileLink = (props: ComponentProps<Link>) => {
    const { children, ...linkProps } = props
    const current = pathname === linkProps.to ? ' text-white' : ''

    return (
      <Link className={`stack items-center p-2 mt-1 hover:text-white${current}`} {...linkProps}>
        {children}
      </Link>
    )
  }

  return (
    <nav>
      {/* default navigation */}
      <div className='hstack bg-white justify-between p-4 shadow text-xl font-medium'>
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
          <ToggleDarkMode size={24} toggled={false} className='cursor-pointer' />
          <DefaultLink to='/settings'><IconUser size={24} /></DefaultLink>
          <IconLogout size={24} className='cursor-pointer' onClick={onLogout} />
        </div>
      </div>

      {/* mobile mavigation */}
      <div className='sm:hidden hstack w-screen fixed bottom-0 bg-gray-900 justify-evenly text-gray-600 text-sm'>
        <MobileLink to='/'><IconHome size={28} /><span>home</span></MobileLink>
        <MobileLink to='/classes'><IconFolder size={28} /><span>classes</span></MobileLink>
        <MobileLink to='/students'><IconStudents size={28} /><span>students</span></MobileLink>
        <MobileLink to='/settings'><IconSettings size={28} /><span>settings</span></MobileLink>
      </div>
    </nav>
  )
}
