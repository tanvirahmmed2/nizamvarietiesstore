import React from 'react'

export const metadata={
    title:'Sales Transaction | Dashboard',
    description:'Sales Transaction Page'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
