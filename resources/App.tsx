import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { TRole } from './typings'
import { request } from './utils'
import { Loader } from './components/Loader'

type TSession = {
  role: TRole;
}

const Landing = lazy(() => import('./views/Landing'))
const Dashboard = lazy(() => import('./views/Dashboard'))

export const App = () => {
  const [session, setSession] = useState<TRole | null | undefined>(null)

  useEffect(() => void (async () => {
    request<TSession>('account').then(({ role }) => setSession(role)).catch(() => setSession(void 0))
  })(), [])

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        {session === null ? <Loader /> : session ? <Dashboard role={session} /> : <Landing setSession={setSession} />}
      </Suspense>
    </BrowserRouter>
  )
}
