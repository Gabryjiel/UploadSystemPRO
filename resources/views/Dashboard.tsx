import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Subjects } from '../components/Subjects'
import { Subject } from '../components/Subject'
import { AddSubject } from '../components/AddSubject'
import { EditSubject } from '../components/EditSubject'
import { AddAssignment } from '../components/AddAssignment'
import { Assignment, NoAssignmentId } from '../components/Assignment'
import { TRole } from '../typings'
import { RoleContext } from '../utils'
import { EditAssignment } from '../components/EditAssignment'
import { Settings } from '../components/Settings'
import { Uni } from '../components/Uni'

type Props = {
  role: TRole;
}

export default function Dashboard ({ role }: Props) {
  return (
    <div className='stack'>
      <RoleContext.Provider value={role}>
        <Navigation />
        <Breadcrumbs className='hidden sm:flex mx-10 mt-3' />
        <main className='mx-3 mt-5 sm:mt-3 sm:mx-10'>
          <Switch>
            <Route path='/classes/new' component={AddSubject} exact />
            <Route path='/classes/:subjectId/new' component={AddAssignment} exact />
            <Route path='/classes/:subjectId/settings' component={EditSubject} exact />
            <Route path='/classes/:subjectId/assignments/:assignmentId/settings' component={EditAssignment} exact />
            <Route path='/classes/:subjectId/assignments/:assignmentId' component={Assignment} exact />
            <Route path='/classes/:subjectId/assignments' component={NoAssignmentId} exact />
            <Route path='/classes/:subjectId' component={Subject} exact />
            <Route path='/classes' component={Subjects} exact />
            <Route path='/settings' component={Settings} exact />
            <Route path='/uni' component={Uni} exact />

            <Route><Redirect to='/' /></Route>
          </Switch>
        </main>
        <div className='w-full h-16 sm:hidden' />
      </RoleContext.Provider>
    </div>
  )
}
