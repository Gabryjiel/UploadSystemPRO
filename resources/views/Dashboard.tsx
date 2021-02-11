import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Subjects } from '../components/Subjects'
import { Subject } from '../components/Subject'
import { AddSubject } from '../components/AddSubject'
import { EditSubject } from '../components/EditSubject'
import { AddAssignment } from '../components/AddAssignment'
import { Assignment } from '../components/Assignment'
import { TRole } from '../typings'

type Props = {
  role: TRole;
}

export default function Dashboard (props: Props) {
  const { role } = props

  return (
    <div className='stack'>
      <Navigation />
      <Breadcrumbs className='hidden sm:flex mx-10 mt-3' />
      <main className='mx-3 mt-5 sm:mt-3 sm:mx-10'>
        <Switch>
          <Route path='/classes/:id/settings' render={(props) => <EditSubject {...props} role={role} />} />
          {role !== 'student' && <Route path='/classes/:id/new' component={AddAssignment} />}
          <Route path='/classes/new'><AddSubject role={role} /></Route>
          <Route path='/classes/:id' render={(props) => <Subject {...props} role={role} />} />
          <Route path='/classes'><Subjects role={role} /></Route>
          <Route path='/assignments/:id' component={Assignment} />
        </Switch>
      </main>
      <div className='w-full h-16 sm:hidden' />
    </div>
  )
}
