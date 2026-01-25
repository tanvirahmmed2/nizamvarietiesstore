'use client'
import AddBrandForm from '@/components/forms/AddBrandForm'
import React, { useState } from 'react'

const BrandPage = () => {
  const [brands, setBrands]= useState([])
  return (
    <div className='w-full p-4 flex flex-col gap-6 items-center'>
      {
        brands.length === 0 ? <div className='w-full min-h-30 flex items-center justify-center text-center'>
          <p className='text-red-500'>Brand data not Found !</p>
        </div> : <div>
          {
            brands.map((brand) => (
              <p key={brand}>{brand}</p>
            ))
          }
        </div>
      }
      <AddBrandForm/>
    </div>
  )
}

export default BrandPage
