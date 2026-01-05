import { isLogin } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'
export const metadata={
    title:'Cart',
    description:'Cart page'
}

const CartLayout = async({children}) => {
    const auth= await isLogin()

    if(!auth.success){
        return redirect('/login')
    }

  return (
    <div>
      {children}
    </div>
  )
}

export default CartLayout
