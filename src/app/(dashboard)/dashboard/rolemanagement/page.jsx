'use client'
import NewRoleForm from '@/components/forms/NewRoleForm'
import React, { useState } from 'react'

const RolemanagementPage = () => {
  const [users, setUsers] = useState([])
  return (
    <div className='w-full flex flex-col items-center gap-6 p-4'>

      {
        users.length === 0 ? <div className='w-full min-h-30 flex items-center justify-center text-center'>
          <p className='text-red-500'>User data not Found !</p>
        </div> : <div>
          {
            users.map((user) => (
              <p key={user}>{user}</p>
            ))
          }
        </div>
      }
      <NewRoleForm />
    </div>
  )
}

export default RolemanagementPage
