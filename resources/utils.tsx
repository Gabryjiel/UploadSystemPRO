import { createContext } from 'react'
import { TFile, TRole } from './typings'

export class ApiError extends Error {
  constructor (public code: number, message?: string) { super(message) }
}

export async function request <T> (method: string, init: RequestInit = {}) {
  const { headers, ...rest } = init

  const opts: RequestInit = {
    headers: {
      ...typeof init.body === 'string' && { 'Content-Type': 'application/json' },
      ...headers
    },
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

export const downloadFile = async (file: TFile) => {
  const blob = await fetch(`/api/files/${file.id}`).then((res) => res.blob())
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.setAttribute('download', file.name)
  a.click()
}

export const RoleContext = createContext<TRole>('student')
