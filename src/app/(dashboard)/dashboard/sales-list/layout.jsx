import React from 'react'

export const metadata={
    title:'Sales List | Dashboard',
    description:'Sales List Page'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
