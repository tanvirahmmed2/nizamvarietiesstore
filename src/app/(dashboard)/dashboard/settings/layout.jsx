import React from 'react'

export const metadata={
    title:'Settings | Dashboard',
    description:'Settings Page'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
