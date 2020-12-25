const { protocol, hostname } = location

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

  const res = await fetch(`${protocol}//api.${hostname}/${method}`, opts)
  if (!res.ok) throw new ApiError(res.status, await res.text())

  const { code, error, data } = await res.json()
  if (error) throw new ApiError(code, error)

  return data as T
}
