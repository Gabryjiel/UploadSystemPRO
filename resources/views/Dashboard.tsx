import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Subjects } from '../components/Subjects'
import { Subject } from '../components/Subject'
import { AddSubject } from '../components/AddSubject'
import { EditSubject } from '../components/EditSubject'
import { AddAssignment } from '../components/AddAssignment'
import { Assignment } from '../components/Assignment'

export default function Landing () {
  return (
    <div className='stack'>
      <Navigation />
      <main className='mx-3 mt-5 sm:mx-10'>
        <Switch>
          <Route path='/classes/:id/settings' component={EditSubject} />
          <Route path='/classes/:id/new' component={AddAssignment} />
          <Route path='/classes/new'><AddSubject role={0} /></Route>
          <Route path='/classes/:id' component={Subject} />
          <Route path='/classes'><Subjects role={0} /></Route>
          <Route path='/assignments/:id' component={Assignment} />
        </Switch>
      </main>
      <div className='w-full h-16 sm:hidden' />
    </div>
  )
}
