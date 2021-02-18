import React, { ComponentProps, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { request, RoleContext, toggleDarkMode } from '../utils'
import { IconLogo, IconDarkMode, IconHome, IconStudents, IconSettings, IconUser, IconFolder, IconLogout } from '../icons'
import { IconBriefcase } from '../icons'

export const Navigation = () => {
  const role = useContext(RoleContext)
  const { pathname } = useLocation()

  const onLogout = async () => {
    await request('auth/logout', { method: 'post' })
    location.href = '/'
  }

  const DefaultLink = (props: ComponentProps<Link> & { icon?: boolean }) => {
    const { icon, children, ...linkProps } = props
    const current = pathname.split('/')[1] === `${linkProps.to}`.slice(1) ? icon ? ' border-current' : ' text-white bg-gray-900 dark:text-black dark:bg-gray-200' : ''

    return (
      <Link className={`hidden sm:block border-transparent hover:border-current border-b-1 p-1${current}`} {...linkProps}>
        {children}
      </Link>
    )
  }

  const MobileLink = (props: ComponentProps<Link>) => {
    const { children, ...linkProps } = props
    const current = pathname.split('/')[1] === `${linkProps.to}`.slice(1) ? ' text-white dark:text-black' : ''

    return (
      <Link className={`stack items-center p-2 pb-1 hover:text-white dark:hover:text-black${current}`} {...linkProps}>
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
            <IconLogo className='w-8 mr-3' />
            <span className='sm:hidden'>Upload System PRO</span>
          </Link>
          <DefaultLink to='/classes'>Classes</DefaultLink>
          <div className='hidden sm:block h-full border-gray-400 border-l-1' />
          {role === 'admin' ? (<>
            <DefaultLink to='/uni'>University</DefaultLink>
            <div className='hidden sm:block h-full border-gray-400 border-l-1' />
            <DefaultLink to='/users'>Users</DefaultLink>
          </>) : (
            <DefaultLink to='/assignments'>Assignments</DefaultLink>
          )}
        </div>
        <div className='hstack items-center space-x-5'>
          <IconDarkMode className='w-6 cursor-pointer' onClick={toggleDarkMode} />
          <DefaultLink icon to='/settings'><IconUser className='w-6' /></DefaultLink>
          <IconLogout className='w-6 cursor-pointer' onClick={onLogout} />
        </div>
      </div>

      {/* mobile mavigation */}
      <div className='sm:hidden kb:hidden hstack w-screen fixed bottom-0 bg-gray-900 dark:bg-gray-200 justify-evenly text-gray-600 dark:text-gray-500 text-sm font-medium'>
        <MobileLink to='/'><IconHome className='w-7' /><span>home</span></MobileLink>
        <MobileLink to='/classes'><IconFolder className='w-7' /><span>classes</span></MobileLink>
        {role === 'admin' && (<>
          <MobileLink to='/uni'><IconBriefcase className='w-7' /><span>uni</span></MobileLink>
          <MobileLink to='/users'><IconStudents className='w-7' /><span>users</span></MobileLink>
        </>)}
        <MobileLink to='/assignments'><IconBriefcase className='w-7' /><span>assignments</span></MobileLink>
        <MobileLink to='/settings'><IconSettings className='w-7' /><span>settings</span></MobileLink>
      </div>
    </nav>
  )
}
