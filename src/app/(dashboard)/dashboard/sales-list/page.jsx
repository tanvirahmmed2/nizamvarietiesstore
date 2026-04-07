'use client'
import PrintOrder from '@/components/buttons/PrintOrder'
import { generateReceipt } from '@/lib/database/print' // Updated to match your receipt function name
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState, useCallback } from 'react'
import { FaBarcode } from 'react-icons/fa'
import { FaPrint } from 'react-icons/fa6'
import { GiConfirmed, GiReturnArrow } from 'react-icons/gi'
import { LuView } from 'react-icons/lu'
import { MdDelete } from 'react-icons/md'
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
    const confirm = window.confirm('Are you sure about returning this?')
    if (!confirm) return
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
    const confirm = window.confirm('Are you sure about deleting this?')
    if (!confirm) return
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
    <div className='w-full min-h-screen flex flex-col items-center p-1 sm:p-4 gap-6 '>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-4'>Sales History</h1>
      <div className='w-full flex flex-row items-center justify-center gap-2 px-2 border border-sky-400'>
        <FaBarcode className='text-2xl text-sky-500' />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='w-full  px-4 p-1 rounded-sm outline-none ' />
      </div>

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
              {order.items?.map((product, pIdx) => (
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
            <span className='col-span-1'>৳{order.total_discount_amount}</span>
            <span className='col-span-1'>৳{order.paid_amount || order.amount_received || 0}</span>
            <div className='w-full col-span-1 flex flex-col gap-1 items-center'>
              {order.status === 'pending' && (
                <button onClick={() => confirmOrder(order.order_id)} className='w-full bg-green-600 text-white cursor-pointer text-center p-2'><GiConfirmed /></button>
              )}
              <button onClick={() => deleteOrder(order.order_id)} className='w-full bg-red-500 text-white cursor-pointer text-center p-2 flex flex-row items-center justify-start gap-4'><MdDelete /> Delete</button>
              {order.status !== 'returned' && (
                <button onClick={() => returnOrder(order.order_id)} className='w-full bg-sky-600 text-white cursor-pointer text-center p-2 flex flex-row items-center justify-start gap-4'><GiReturnArrow /> Return</button>
              )}

              <button onClick={() => generateReceipt(order)} className='w-full bg-sky-600 text-white cursor-pointer text-center p-2 flex flex-row items-center justify-start gap-4'><FaPrint /> Print</button>
              <Link href={`/dashboard/pos/${order.order_id}`} className='w-full bg-sky-600 text-white cursor-pointer text-center p-2 flex flex-row items-center justify-start gap-4'><LuView /> View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalesListPage