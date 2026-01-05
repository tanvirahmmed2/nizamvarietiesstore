import Logout from '@/components/buttons/Logout'
import UserIcon from '@/components/card/UserIcon'
import { isLogin } from '@/lib/middleware'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const Profile = async () => {
  const auth = await isLogin()
  if (!auth.success) return redirect('/login')
  const data = auth.payload


  return (
    <div className='w-full min-h-screen flex items-center justify-center p-4'>
      <div className='w-full md:w-3/4 border border-red-400 min-h-[60vh]  rounded-lg flex flex-col items-center p-4 justify-between'>

        <div className='flex flex-col items-center justify-center gap-2'>

          <h1 className='text-2xl text-center'>Profile</h1>
          <UserIcon />
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-semibold'>{data.name}</h1>
            <p className='opacity-60'>{data.role}</p>

          </div>
         <div className='w-auto grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='p-2 border border-red-300 rounded-lg flex flex-col gap-2'>
            <p className='w-full text-center border-b-2 opacity-30'>Phone</p>
            <p>{data?.phone || '....'}</p>
          </div>
          <div className='p-2 border border-red-300 rounded-lg flex flex-col gap-2'>
            <p className='w-full text-center border-b-2 opacity-30'>Email</p>
            <p>{data?.email || '....'}</p>
          </div>
          <div className='p-2 border border-red-300 rounded-lg flex flex-col gap-2'>
            <p className='w-full text-center border-b-2 opacity-30'>Address</p>
            <p>{data?.address || '....'}</p>
          </div>
          <Link href={'/update'}className='p-2 border border-red-300 rounded-lg flex item-center justify-center w-full h-full gap-2'>
            Update
          </Link>

         </div>

        </div>
        <Logout />
      </div>

    </div>
  )
}

export default Profile
