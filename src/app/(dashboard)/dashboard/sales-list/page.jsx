'use client'
import PrintOrder from '@/components/buttons/PrintOrder'
import { printOrder } from '@/lib/database/orderPrint'
import axios from 'axios'
import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

const SalesListPage = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchOrder = useCallback(async () => {
    try {
      const response = await axios.get(`/api/order/search?q=${searchTerm}`, { withCredentials: true })
      setOrders(response.data.payload || [])
    } catch (error) {
      console.log(error?.response?.data?.message)
      setOrders([])
    }
  }, [searchTerm])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const returnOrder = async (orderId) => {
    try {
      const res = await axios.put('/api/order', { orderId, action: 'return' })
      if (res.data.success) {
        toast.success(res.data.message)
        fetchOrder() 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Return failed")
    }
  }

  const deleteOrder = async (orderId) => {
    try {
      const res = await axios.put('/api/order', { orderId, action: 'delete' })
      if (res.data.success) {
        toast.success("Order deleted")
        fetchOrder()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed")
    }
  }

  const confirmOrder = async (orderId) => {
    try {
      const res = await axios.put('/api/order', { orderId, action: 'confirm' })
      if (res.data.success) {
        toast.success("Order confirmed")
        fetchOrder()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Confirmation failed")
    }
  }

  console.log(orders)

  return (
    <div className='w-full min-h-screen flex flex-col items-center p-6 gap-6 '>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-4'>Sales History</h1>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
      <div className='w-full flex flex-col gap-2 items-center justify-center'>
        {orders.length > 0 && orders.map((order, idx) => (
          <div key={idx}
            className='w-full grid grid-cols-12 p-2 border rounded-xl even:bg-gray-200'
          >
            <div className='flex flex-col gap-1 w-full col-span-3'>
              <p className='font-medium text-gray-700'>Name: <span className='font-semibold text-gray-900'>{order.name}</span></p>
              <p className='font-medium text-gray-700'>Phone: <span className='font-semibold text-gray-900'>{order.phone}</span></p>
              <p className='text-xs text-blue-600 font-bold uppercase'>{order.status}</p>
            </div>
            <div className=' w-full flex flex-col gap-1 col-span-5'>
              <p className='font-medium text-gray-700 mb-1'>Products ({order.total_items_count} items):</p>
              <ul className='w-full list-disc list-inside text-gray-800'>
                {order.product_list.map((product, pIdx) => (
                  <li key={pIdx} className='w-full grid grid-cols-6'>
                    <p className='col-span-4'>{product.name}</p>
                    <p className='col-span-1'>Qty: {product.quantity}</p>
                    <div className='col-span-1 flex flex-col'>
                      <p >৳{Number(product.price) * Number(product.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex flex-col gap-1 col-span-3'>
              <p className='font-medium text-gray-700'>Total: <span className='font-semibold text-gray-900'>{order.total_amount}</span></p>
              <p className='font-medium text-gray-700'>Discount: <span className='font-semibold text-gray-900'>{order.discount}</span></p>
              <p className='font-medium text-gray-700'>Payment Status: <span className='font-semibold text-gray-900'>{order.payment_status}</span></p>
              <p className='font-medium text-gray-700'>Date: <span className='font-semibold text-gray-900'>{order.date?.slice(0, 10)}</span></p>
            </div>

            <div className='w-full col-span-1 flex flex-col gap-1'>
              {order.status === 'pending' && (
                <button onClick={() => confirmOrder(order.order_id)} className='w-full bg-green-600 text-white cursor-pointer'>Confirm</button>
              )}
              <button onClick={() => deleteOrder(order.order_id)} className='w-full bg-sky-600 text-white cursor-pointer'>Delete</button>
              {order.status !== 'returned' && (
                <button onClick={() => returnOrder(order.order_id)} className='w-full bg-sky-600 text-white cursor-pointer'>Return</button>
              )}
              <button onClick={() => printOrder(order)} className='w-full bg-sky-600 text-white cursor-pointer'>Print</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalesListPage