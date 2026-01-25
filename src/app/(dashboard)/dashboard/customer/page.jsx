'use client'
import React, { useState } from 'react'

const CustomerPage = () => {
  const [customers, setCustomers] = useState([])
  return (
    <div className='w-full p-4 flex flex-col gap-6 items-center'>
      {
        customers.length === 0 ? <div className='w-full min-h-30 flex items-center justify-center text-center'>
          <p className='text-red-500'>Customer data not Found !</p>
        </div> : <div>
          {
            customers.map((customer) => (
              <p key={customer}>{customer}</p>
            ))
          }
        </div>
      }
    </div>
  )
}

export default CustomerPage
