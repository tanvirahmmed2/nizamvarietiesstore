'use client'
import PrintOrder from '@/components/buttons/PrintOrder'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const SalesListPage = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/order/search?q=${searchTerm}`, { withCredentials: true })
        setOrders(response.data.payload)
      } catch (error) {
        console.log(error?.response?.data?.message)
        setOrders([])
      }
    }
    fetchOrder()
  }, [searchTerm])

  return (
    <div className='w-full min-h-screen flex flex-col items-center p-6 gap-6 '>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-4'>Sales History</h1>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
      <div className='w-full flex flex-col gap-2 items-center justify-center'>
        {orders.length > 0 && orders.map((order, idx) => (
          <div
            key={idx}
            className='w-full flex flex-col items-center justify-center gap-2 p-2 border rounded-xl even:bg-gray-200'
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

            <div className=' w-full'>
              <p className='font-medium text-gray-700 mb-1'>Products ({order.total_items_count} items):</p>
              <ul className='w-full list-disc list-inside text-gray-800'>
                {order.product_list.map((product, pIdx) => (
                  <li key={pIdx} className='w-full grid grid-cols-6'>
                    <p className='col-span-4'>{product.name}</p>
                    <p className='col-span-1'>Quantity: {product.quantity}</p>
                    <div className='col-span-1 flex flex-col'>
                      <p >Price:৳{product.sale_price *product.quantity }</p>
                      {
                        product.discount_price > 0 && <p className='text-xs'> (- {product.discount_price *product.quantity})</p>
                      }
                      </div>
                  </li>
                ))}
              </ul>
            </div>
            <PrintOrder order={order} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalesListPage
