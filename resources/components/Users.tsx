import React, { ChangeEvent, Dispatch, FormEvent, Fragment, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Redirect } from 'react-router-dom'
import { IconClose, IconDone, IconStar } from '../icons'
import { TDetailedUser, TGroup, TSemester, TSubgroup, TUniClassProps, TUser } from '../typings'
import { getBGColor, request, RoleContext } from '../utils'
import { InputText } from './InputText'
import { Loader } from './Loader'
import { Select } from './Select'

type TForm = {
  name: string;
}

type TUserTableProps = {
  oldUsers?: TDetailedUser[] | null;
  setOldUsers: Dispatch<React.SetStateAction<TDetailedUser[] | null | undefined>>;
}

const UserTable = (props: TUserTableProps) => {
  const { oldUsers, setOldUsers } = props
  const [users, setUsers] = useState<TDetailedUser[] | null | undefined>(oldUsers)

  useEffect(() => void setUsers(oldUsers), [oldUsers])

  const getRole = (role: number) => {
    return role === 0 ? 'admin' : role === 1 ? 'teacher' : role === 2 ? 'student' : 'unknown'
  }

  const onRoleChange = (name: string, id: number) => async (event: FormEvent<HTMLSelectElement>) => {
    const role = +event.currentTarget.value

    const msg = `Are you sure that you want to upgrade user '${name}' to role '${getRole(role)}'?`
    if (!confirm(msg)) return

    await request(`users/${id}`, { method: 'PATCH', body: JSON.stringify({ role }) })
    setUsers(users?.map((user) => user.id === id ? { ...user, role, upgrade_requested: false } : user))
  }

  const onNameChange = (id: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value

    setUsers(users?.map((user) => user.id === id ? { ...user, name } : user))
  }

  const onNameEdit = async (id: number, name: string) => {
    await request(`users/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) })
    setOldUsers(users)
  }


  const onDelete = async (id: number, name: string) => {
    const msg = `Are you sure that you want to delete user '${name}'?`
    if (!confirm(msg)) return

    await request(`users/${id}`, { method: 'delete' })
    setUsers(users?.filter((user) => user.id !== id))
  }

  return (
    <div className='grid grid-cols-users items-center gap-2 font-medium dark:font-normal'>
        {users?.map(({ id, name, role, upgrade_requested, email }) => {
          return (
            <Fragment key={id}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${getBGColor(name.charCodeAt(0) % 7)} flex items-center justify-center text-3xl sm:text-4xl font-normal text-white`}>{name[0]}</div>
              <div className='hstack self-start ml-1 min-w-0 h-full'>
                <div className='stack flex-grow'>
                  <input
                    className='w-full bg-transparent border-none focus:outline-none' value={name} onChange={onNameChange(id)}
                    type='text' autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false'
                  />
                  <span className='text-xs sm:text-sm font-normal dark:font-light'>{email}</span>
                </div>
                <IconDone
                  className={`ml-auto w-4 sm:w-6 text-green-500 cursor-pointer${oldUsers?.find(({ id: ind }) => ind === id)?.name === name ? ' invisible' : ''}`}
                  onClick={() => onNameEdit(id, name)}
                />
              </div>
              <div className='text-center text-xs sm:text-base whitespace-nowrap'>
                <Select value={role} onChange={onRoleChange(name, id)}>
                  <option value={2}>student</option>
                  <option value={1}>teacher</option>
                  <option value={0}>admin</option>
                </Select>
              </div>
              <div className='hstack text-center text-xs sm:text-base whitespace-nowrap'>
                {upgrade_requested && <IconStar className='w-4 sm:w-6 mr-2 ml-auto' />}
                <IconClose className='ml-auto mr-2 w-4 sm:w-6 text-red-500 cursor-pointer' onClick={() => onDelete(id, name)} />
              </div>
              <div className='col-span-full border-b-1 border-current' />
            </Fragment>
          )
        })}
    </div>
  )
}

export const Users = () => {
  const role = useContext(RoleContext)
  const [search, setSearch] = useState<TDetailedUser[] | null>(null)
  const [query, setQuery] = useState<string>('')
  const [users, setUsers] = useState<TDetailedUser[] | null | undefined>(null)

  useEffect(() => {
    request<TDetailedUser[]>('users').then((data) => users === null && setUsers(data))

    return () => setUsers(void 0)
  }, [])

  useEffect(() => {
    if (query === '') return setSearch(null)
    const includes = (str: string, substr: string) => str.toLowerCase().indexOf(substr.toLocaleLowerCase()) !== -1

    const search = users ? users.filter(({ name }) => includes(name, query)) : null

    setSearch(search)
  }, [query])

  return (
    <div className='stack'>
      <div className='hstack mb-2 justify-between'>
        <h1 className='text-xl sm:text-2xl px-1 pt-1 mt-1 border-l-1 border-current'>All Users</h1>
      </div>
      <h1 className='sm:text-lg font-light ml-1 mb-5 overflow-hidden overflow-ellipsis box orient-vertical clamp-2'>List of all registered users</h1>
      <div className='hstack justify-between mb-10'>
        <h1 className='text-lg sm:text-xl px-2 border-b-1 border-current'>users</h1>
        <div className='min-w-0 my-auto w-44 md:w-52'>
          <InputText
            variant='outlined' placeholder='search' name='search' onChange={({ currentTarget: { value } }) => setQuery(value)}
            label='search' className='text-md' value={query} onClose={() => setQuery('')}
          />
        </div>
      </div>

      <UserTable oldUsers={search ?? users} setOldUsers={setUsers} />
      {users === null && <Loader />}
      {role !== 'admin' && <Redirect to='/' />}
    </div>
  )
}
