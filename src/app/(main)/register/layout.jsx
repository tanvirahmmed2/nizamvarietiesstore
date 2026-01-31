
import React from 'react'
export const metadata={
    title:'Register',
    description:'Register page'
}

const RegisterLayout = async({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default RegisterLayout
