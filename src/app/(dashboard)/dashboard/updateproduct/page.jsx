'use client'
import AddProductForm from '@/components/forms/AddProductForm'
import UpdateProductForm from '@/components/forms/UpdateProductForm'
import { Context } from '@/components/helper/Context'
import React, { useContext, useState } from 'react'

const NewProductPage = () => {
  const [product, setProduct]= useState([])
  return (
    <div className='w-full p-4 relative'>
      
      <UpdateProductForm product={product}/>
    </div>
  )
}

export default NewProductPage
