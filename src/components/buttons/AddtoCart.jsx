'use client'
import React, { useContext } from 'react'
import { CiShoppingCart } from "react-icons/ci";
import { Context } from '../helper/Context';

const AddtoCart = ({product}) => {
  const {addToCart}= useContext(Context)
  return (
    <button onClick={()=> addToCart(product)} className='w-full p-2.5 bg-primary hover:bg-primary/90 transition-all font-bold rounded-xl flex flex-row items-center justify-center gap-2 text-white cursor-pointer active:scale-95 shadow-sm'>
      <span>Add to Cart</span>
      <CiShoppingCart className='text-xl' />
    </button>
  )
}

export default AddtoCart
