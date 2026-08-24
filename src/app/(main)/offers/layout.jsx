import React from 'react'

export const metadata={
    title:'Offers | NVS',
    description:'Offer page'
}


const Menuayout = async({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default Menuayout
