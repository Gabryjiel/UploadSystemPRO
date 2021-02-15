import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Subjects } from '../components/Subjects'
import { Subject } from '../components/Subject'
import { AddSubject } from '../components/AddSubject'
import { EditSubject } from '../components/EditSubject'
import { AddAssignment } from '../components/AddAssignment'
import { Assignment } from '../components/Assignment'
import { TRole } from '../typings'
import { RoleContext } from '../utils'
import { EditAssignment } from '../components/EditAssignment'

type Props = {
  role: TRole;
}

export default function Dashboard ({ role }: Props) {
  return (
    <div className='stack'>
      <Navigation />
      <Breadcrumbs className='hidden sm:flex mx-10 mt-3' />
      <main className='mx-3 mt-5 sm:mt-3 sm:mx-10'>
        <RoleContext.Provider value={role}>
          <Switch>
            <Route path='/classes/:id/settings' component={EditSubject} exact />
            <Route path='/classes/:id/new' component={AddAssignment} exact />
            <Route path='/classes/new' component={AddSubject} exact />
            <Route path='/classes/:id' component={Subject} exact />
            <Route path='/classes' component={Subjects} exact />

            <Route path='/assignments/:id/settings' component={EditAssignment} exact />
            <Route path='/assignments/:id' component={Assignment} exact />

            <Route><Redirect to='/' /></Route>
          </Switch>
        </RoleContext.Provider>
      </main>
      <div className='w-full h-16 sm:hidden' />
    </div>
  )
}
