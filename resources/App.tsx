import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { request } from './utils'
import { Loader } from './components/Loader'

const Landing = lazy(() => import('./views/Landing'))
const Dashboard = lazy(() => import('./views/Dashboard'))

export const App = () => {
  const [session, setSession] = useState<boolean>(false)

  useEffect(() => void (async () => {
    request('session').then(() => setSession(true)).catch(() => setSession(false))
  })(), [])

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        {session ? <Dashboard /> : <Landing />}
      </Suspense>
    </BrowserRouter>
  )
}
