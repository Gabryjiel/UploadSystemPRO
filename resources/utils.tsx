import { createContext } from 'react'
import { TRole } from './typings'

export class ApiError extends Error {
  constructor (public code: number, message?: string) { super(message) }
}

export async function request <T> (method: string, init: RequestInit = {}) {
  const { headers, ...rest } = init
  const creds = localStorage.getItem('credentials')

  const opts: RequestInit = {
    headers: {
      ...creds && { 'Authorization': `Basic ${creds}` },
      ...init.body && { 'Content-Type': 'application/json' },
      ...headers
    },
    ...init.body && { method: 'post' },
    ...rest
  }

  const res = await fetch(`/api/${method}`, opts)
  const { error, data } = await res.json()

  if (error) throw new ApiError(res.status, error)

  return data as T
}

export const toggleDarkMode = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    return localStorage.removeItem('mode')
  }

  document.documentElement.classList.remove('light')
  document.documentElement.classList.add('dark')
  localStorage.setItem('mode', 'dark')
}

export const getBGColor = (index: number) => {
  const colors = ['yellow', 'green', 'gray', 'red', 'blue', 'indigo', 'purple']
  return `bg-${colors[index]}-700`
}

export const RoleContext = createContext<TRole>('student')
