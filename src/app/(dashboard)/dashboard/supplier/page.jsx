'use client'
import React, { useState } from 'react'

const SupplierPage = () => {
   const [suppliers, setSuppliers] = useState([])
    return (
      <div className='w-full p-4 flex flex-col gap-6 items-center'>
        {
          suppliers.length === 0 ? <div className='w-full min-h-30 flex items-center justify-center text-center'>
            <p className='text-red-500'>Supplier data not Found !</p>
          </div> : <div>
            {
              suppliers.map((supplier) => (
                <p key={supplier}>{supplier}</p>
              ))
            }
          </div>
        }
    </div>
  )
}

export default SupplierPage
