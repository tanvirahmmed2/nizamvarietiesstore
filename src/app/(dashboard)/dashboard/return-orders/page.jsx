'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { printOrder } from '@/lib/database/orderPrint'

const ReturnedOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/order/status?q=returned`)
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
        toast.success("Order Confirmed")
        fetchOrders()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Confirmation failed")
    }
  }

  const deleteOrder = async (orderId) => {
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

  if (loading) return <p className='text-center text-gray-500 mt-10'>Loading returned orders...</p>
  if (orders.length === 0) return <p className='text-center text-gray-500 mt-10'>No returned orders found</p>

  return (
    <div className='w-full min-h-screen flex flex-col items-center p-1 sm:p-4 gap-6 '>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-4'>Returned Orders</h1>

      <div className='w-full flex flex-col gap-2 items-center justify-center'>
        <div className='w-full grid grid-cols-10 p-1 even:bg-slate-200 text-sm rounded-lg shadow'>
          <p className='col-span-1'>Date</p>
          <p className='col-span-1'>Name</p>
          <p className='col-span-1'>Phone</p>
          <p className='col-span-3'>Products</p>
          <p className='col-span-1'>Total</p>
          <p className='col-span-1'>Discount</p>
          <p className='col-span-1'>Paid</p>
          <p className='col-span-1'>Action</p>
        </div>
        {orders.length > 0 && orders.map((order, idx) => (
          <div key={idx}
            className='w-full grid grid-cols-10 p-1 even:bg-slate-200 text-sm rounded-lg shadow'
          >
            <p className='col-span-1'>{(order.created_at || order.date)?.slice(0, 10)}</p>
            <p className='col-span-1'>{order.name}</p>
            <p className='col-span-1'>{order.phone}</p>
            <div className='w-full col-span-3'>
              {order.product_list?.map((product, pIdx) => (
                <div key={pIdx} className='w-full grid grid-cols-6'>
                  <p className='col-span-4'>{product.name}</p>
                  <p className='col-span-1'>{product.quantity}</p>
                  <div className='col-span-1 flex flex-col'>
                    <p >৳{Number(product.price) * Number(product.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <span className='col-span-1'>৳{order.total_amount}</span>
            <span className='col-span-1'>৳{order.discount}</span>
            <span className='col-span-1'>৳{order.paid_amount || order.amount_received || 0}</span>
            <div className='w-full col-span-1 flex flex-col gap-1 items-center'>
              {order.status === 'pending' && (
                <button onClick={() => confirmOrder(order.order_id)} className='w-full bg-green-600 text-white cursor-pointer py-1 text-xs rounded hover:bg-green-700'>Confirm</button>
              )}
              <button onClick={() => deleteOrder(order.order_id)} className='w-full bg-red-500 text-white cursor-pointer py-1 text-xs rounded hover:bg-red-600'>Delete</button>
              <button onClick={() => printOrder(order)} className='w-full bg-sky-600 text-white cursor-pointer py-1 text-xs rounded hover:bg-sky-700'>Print</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReturnedOrdersPage