import AddProduct from '@/components/forms/AddProduct'
import React from 'react'

const NewProduct = () => {
  return (
    <div className='w-full p-4 flex flex-col items-center gap-6'>
      <h1 className='text-2xl font-semibold w-full text-center border-b-2 border-black/10'>Products</h1>
      <AddProduct />
      
    </div>
  )
}

export default NewProduct
