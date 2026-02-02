import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const SalesListPage = async () => {
  const res = await fetch(`${BASE_URL}/api/order`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()
  if (!data.success) return <p className='text-center text-gray-500 mt-10'>No history found</p>
  const orders = data.payload


  return (
    <div className='w-full min-h-screen flex flex-col items-center p-6 gap-6 '>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-4'>Sales History</h1>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {orders.length > 0 && orders.map((order, idx) => (
          <div 
            key={idx} 
            className='w-full flex flex-col p-4 rounded-xl border border-gray-200 shadow-md bg-white hover:shadow-lg transition-shadow duration-200'
          >
            <div className='flex flex-row w-full  justify-between'>
              <div className='flex flex-col gap-1 mb-2'>
                <p className='font-medium text-gray-700'>Name: <span className='font-semibold text-gray-900'>{order.name}</span></p>
                <p className='font-medium text-gray-700'>Phone: <span className='font-semibold text-gray-900'>{order.phone}</span></p>
              </div>

              <div className='flex flex-col gap-1 mb-2'>
                <p className='font-medium text-gray-700'>Total: <span className='font-semibold text-gray-900'>{order.total_amount}</span></p>
                <p className='font-medium text-gray-700'>Discount: <span className='font-semibold text-gray-900'>{order.discount}</span></p>
                <p className='font-medium text-gray-700'>Payment Status: <span className='font-semibold text-gray-900'>{order.payment_status}</span></p>
                <p className='font-medium text-gray-700'>Date: <span className='font-semibold text-gray-900'>{order.date.slice(0, 10)}</span></p>
              </div>

            </div>

            <div className='mt-2'>
              <p className='font-medium text-gray-700 mb-1'>Products ({order.total_items_count} items):</p>
              <ul className='list-disc list-inside text-gray-800'>
                {order.product_list.map((product, pIdx) => (
                  <li key={pIdx}>
                    {product.name} - Qty: {product.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalesListPage
