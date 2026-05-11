import React from 'react'

export const metadata={
    title:'Purchase List',
    description:'Purchase List page'
}


const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
