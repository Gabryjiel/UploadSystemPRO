import React, { useState, useEffect, Suspense, lazy } from 'react'
import { request } from './utils'
import { Loader } from './components/Loader'
import { Landing } from './views/Landing'
// import { TSession } from './typings'

// const Landing = lazy(() => import('./views/Landing'))
// const Home = lazy(() => import('./views/Home'))

export const App = () => {
  // const [session, setSession] = useState<TSession | null | undefined>()

  // useEffect(() => void (async () => {
  //   await inviteHandler().catch(() => void 0)
  //   request<TSession>('session').then(setSession).catch(() => setSession(null))
  // })(), [])

  return (
    <Suspense fallback={<Loader />}>
      <Landing />
    </Suspense>
  )
}
