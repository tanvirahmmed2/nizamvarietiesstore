'use client'
import NewStaffForm from '@/components/forms/NewStaffForm'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const RolemanagementPage = () => {
  const [staffs, setStaffs] = useState([])

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('/api/staff', { withCredentials: true })
        setStaffs(response.data.payload)
      } catch (error) {
        console.log(error)
        setStaffs([])
      }

    }
    fetchStaff()
  }, [])
  return (
    <div className='w-full flex flex-col items-center gap-6 p-4'>

      {
        staffs.length === 0 ? <div className='w-full min-h-30 flex items-center justify-center text-center'>
          <p className='text-red-500'>User data not Found !</p>
        </div> : <div className='w-full flex flex-col items-center justify-center gap-4'>
          <h1 className='text-2xl font-semibold'>Staffs</h1>
          {
            staffs.map((staff) => (
              <div key={staff.staff_id} className='w-full grid grid-cols-4 lgap-2 border shadow-sm shadow-sky-800 rounded-sm p-2'>
                <p >{staff.name}</p>
                <p>{staff.email}</p>
                <p>{staff.role}</p>
                <button >Remove</button>
              </div>
            ))
          }
        </div>
      }
      <NewStaffForm />
    </div>
  )
}

export default RolemanagementPage
