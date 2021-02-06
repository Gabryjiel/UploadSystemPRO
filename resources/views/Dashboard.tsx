import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Subjects } from '../components/Subjects'
import { AddSubject } from '../components/AddSubject'

export default function Landing () {
  return (
    <div className='stack'>
      <Navigation />
      <main className='mx-3 mt-5 sm:mx-10'>
        <Switch>
          <Route path='/classes/new'><AddSubject role={0} /></Route>
          <Route path='/classes'><Subjects role={0} /></Route>
        </Switch>
      </main>
      <div className='w-full h-16 sm:hidden' />
    </div>
  )
}
