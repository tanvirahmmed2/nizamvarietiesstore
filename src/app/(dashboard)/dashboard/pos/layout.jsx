import React from 'react'

export const metadata={
    title:'POS Sale',
    description:'Pos Sale Page'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
