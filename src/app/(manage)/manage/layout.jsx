import ManageNavbar from '@/components/bar/ManageNavbar'
import { isManager } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'
export const metadata={
  title:'Management',
  descritpion:'Management Page'
}


const ManageLayout = async({children}) => {
  const auth= await isManager()
  if(!auth.success){
    return redirect('/login')
  }
  return (
    <div className='w-full '>
      <ManageNavbar/>
      {children}
    </div>
  )
}

export default ManageLayout
