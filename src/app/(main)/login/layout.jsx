
import React from 'react'
export const metadata={
    title:'Login',
    description:'Login page'
}

const LoginLayout = async({children}) => {
    
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default LoginLayout
