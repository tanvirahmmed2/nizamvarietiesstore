import React from 'react'

export const metadata={
    title:'User Management | Dashboard',
    description:'User Management Page'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
