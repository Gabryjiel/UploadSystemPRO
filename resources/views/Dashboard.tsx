import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Subjects } from '../components/Subjects'

export default function Landing () {
  return (
    <div className='stack'>
      <Navigation />
      <main className='mx-3 mt-5 sm:mx-5'>
        <Switch>
          <Route path='/classes'><Subjects role={0} /></Route>
        </Switch>
      </main>
      <div className='w-full h-16 sm:hidden' />
    </div>
  )
}
