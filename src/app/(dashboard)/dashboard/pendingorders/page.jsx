'use client'
import { BASE_URL } from '@/lib/database/secret'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { generateReceipt } from '@/lib/database/print'

const PendingOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/order/status?q=pending`)
      if (res.data.success) {
        setOrders(res.data.payload)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const confirmOrder = async (orderId) => {
    try {
      const res = await axios.put('/api/order', { orderId, action: 'confirm' })
      if (res.data.success) {
        toast.success("Order Confirmed & Stock Updated")
        fetchOrders() 
        generateReceipt(res.data.payload)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Confirmation failed")
    }
  }

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await axios.put('/api/order', { orderId, action: 'delete' })
      if (res.data.success) {
        toast.error("Order Deleted")
        fetchOrders() 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed")
    }
  }

  if (loading) return <p className='text-center text-gray-500 mt-10'>Loading pending orders...</p>
  if (orders.length === 0) return <p className='text-center text-gray-500 mt-10'>No pending orders found</p>

  return (
    <div className='w-full min-h-screen flex flex-col items-center p-6 gap-6 '>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-4'>Pending Orders</h1>

      <div className='w-full flex flex-col gap-2 items-center justify-center'>
        {orders.map((order, idx) => (
          <div 
            key={order.order_id || idx} 
            className='w-full flex flex-col items-center justify-center gap-2 p-2 border rounded-xl even:bg-gray-200'
          >
            <div className='flex flex-row w-full justify-between'>
              <div className='flex flex-col gap-1 mb-2'>
                <p className='font-medium text-gray-700'>Name: <span className='font-semibold text-gray-900'>{order.name}</span></p>
                <p className='font-medium text-gray-700'>Phone: <span className='font-semibold text-gray-900'>{order.phone}</span></p>
              </div>

              <div className='flex flex-col gap-1 mb-2'>
                <p className='font-medium text-gray-700'>Total: <span className='font-semibold text-gray-900'>{order.total_amount}</span></p>
                <p className='font-medium text-gray-700'>Discount: <span className='font-semibold text-gray-900'>{order.discount}</span></p>
                <p className='font-medium text-gray-700'>Payment Status: <span className='font-semibold text-gray-900'>{order.payment_status}</span></p>
                <p className='font-medium text-gray-700'>Date: <span className='font-semibold text-gray-900'>{order.date?.slice(0, 10)}</span></p>
              </div>
            </div>

            <div className='w-full'>
              <p className='font-medium text-gray-700 mb-1'>Products ({order.total_items_count || order.product_list?.length} items):</p>
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

            <div className='w-full flex flex-col items-center justify-center gap-1 mt-4'>
                <button 
                  onClick={() => confirmOrder(order.order_id)}
                  className='w-full bg-gray-400 hover:bg-blue-600 hover:text-white transition-colors  rounded'
                >
                  Confirm
                </button>
                <button 
                  onClick={() => cancelOrder(order.order_id)}
                  className='w-full bg-gray-400 hover:bg-red-600 hover:text-white transition-colors  rounded'
                >
                  Delete
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingOrdersPage