'use client'
import React, { useContext } from 'react'
import Orderform from '../forms/Orderform'
import { Context } from '../helper/Context'

const SalesCart = () => {
const { cart } = useContext(Context)
  return (
    <div className='flex-1  p-4 flex flex-col items-center gap-6'>
      <h1 className='text-xl font-semibold'>Order details</h1>
      <Orderform cartItems={cart?.items}  />
    </div>
  )
}

export default SalesCart
