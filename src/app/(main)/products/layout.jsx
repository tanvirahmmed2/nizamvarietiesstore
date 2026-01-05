import React from 'react'

export const metadata={
    title:'Products',
    description:'Products site'
}


const Menuayout = async({children}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default Menuayout
