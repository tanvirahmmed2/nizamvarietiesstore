import React from 'react'

export const metadata={
    title:'Purchase Transactions',
    description:'Purchase Transactions page'
}


const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
