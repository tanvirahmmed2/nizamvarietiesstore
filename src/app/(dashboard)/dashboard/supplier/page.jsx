
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const SupplierPage = async () => {

  const res = await fetch(`${BASE_URL}/api/supplier`, {
    method: 'GET',
    cache: 'no-store'
  })
  const data = res.json()
  if (!data.success) return <p className='w-full text-center'>No result found</p>
  const suppliers = data.payload
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
