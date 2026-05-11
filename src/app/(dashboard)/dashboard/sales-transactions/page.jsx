
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const TransactionsPage = async () => {


  const res = await fetch(`${BASE_URL}/api/payment`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()
  if (!data.success) return <p className='text-center text-gray-500 mt-10'>No history found</p>
  const transactions = data.payload

  return (
    <div className='w-full min-h-screen flex flex-col items-center p-1 sm:p-4 gap-6 '>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-4'>Transaction History</h1>
      <div
        className='w-full grid grid-cols-6 gap-4 p-2 bg-sky-500 text-white rounded-2xl'
      >
        <p className='font-medium col-span-1'>Date </p>
        <p className='font-medium col-span-1'>Name</p>
        <p className='font-medium col-span-1'>Phone</p>
        <p className='font-medium col-span-1'>Sub Total</p>
        <p className='font-medium col-span-1'>Discount</p>
        <p className='font-medium col-span-1'>Paid Amount</p>

      </div>
      <div className='w-full flex flex-col gap-1'>
        {transactions.length > 0 && transactions.map((t, idx) => (
          <div
            key={idx}
            className='w-full grid grid-cols-6 gap-4 p-2 bg-slate-50 even:bg-slate-200'
          >
            <p className='font-medium col-span-1'>{t.date.slice(0, 10)}</p>
            <p className='font-semibold col-span-1'>{t.name}</p>
            <p className='font-medium col-span-1'>{t.phone}</p>
            <p className='font-medium col-span-1'>৳ {t.subtotal}</p>
            <p className='font-medium col-span-1'>৳ {t.discount}</p>
            <p className='font-semibold col-span-1'>৳ {t.payment_amount}</p>

          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionsPage
