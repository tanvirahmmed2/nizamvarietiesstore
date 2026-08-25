import React from 'react'

export const metadata={
    title:'Sales | Dashboard',
    description:'Sales Page'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
