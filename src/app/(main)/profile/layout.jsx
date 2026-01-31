
import React from 'react'

export const metadata={
    title:'Profile',
    description:'MenuBar site'
}


const ProfileLayout = async({children}) => {
   
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default ProfileLayout
