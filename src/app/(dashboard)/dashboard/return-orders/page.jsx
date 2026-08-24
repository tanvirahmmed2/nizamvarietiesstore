'use client'
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { generateReceipt } from '@/lib/database/print'
import { printOrder } from '@/lib/database/orderPrint'
import { FaBarcode, FaCheck, FaXmark } from 'react-icons/fa6'
import { GiConfirmed } from 'react-icons/gi'
import { MdDelete } from 'react-icons/md'
import { IoPrintOutline } from 'react-icons/io5'
import Link from 'next/link'
import { GoEye } from 'react-icons/go'
import { BsThreeDotsVertical } from 'react-icons/bs'

const ReturnedOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/order/status?q=returned`)
      if (res.data.success) {
        setOrders(res.data.payload || [])
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const deleteOrder = async (orderId) => {
    try {
      const res = await axios.put('/api/order', { orderId, action: 'delete' })
      if (res.data.success) {
        toast.success("Order Deleted")
        setConfirmDelete(null)
        setOpenMenuId(null)
        fetchOrders()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed")
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const dateObj = new Date(dateStr)
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const filteredOrders = orders.filter(order => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return (
      order.order_id?.toString().toLowerCase().includes(term) ||
      order.name?.toLowerCase().includes(term) ||
      order.phone?.toLowerCase().includes(term)
    )
  })

  return (
    <div className='w-full flex flex-col gap-4 bg-slate-50 min-h-screen relative'>
      {openMenuId !== null && (
        <div 
          className="fixed inset-0 z-30 bg-transparent cursor-default" 
          onClick={() => setOpenMenuId(null)} 
        />
      )}

      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Returned Orders</h1>
          <p className='text-sm text-slate-500 mt-1'>View orders that have been returned by customers</p>
        </div>
        <div className='w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          {orders.length > 0 && (
            <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-700 px-3 py-2.5 rounded-xs text-center whitespace-nowrap border border-rose-200">
              Returned: {orders.length} Orders
            </span>
          )}
          <div className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xs border border-slate-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100/50 transition-all sm:w-72'>
            <FaBarcode className='text-slate-400 text-lg' />
            <input 
              type="text" 
              placeholder="Search returned orders..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}  
              className='bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400'
            />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 sm:gap-3 px-4 sm:px-5 py-3 bg-white border border-slate-200 rounded-xs font-bold text-slate-500 text-[11px] sm:text-xs uppercase tracking-wider shadow-xs items-center">
        <div className="col-span-3 sm:col-span-2 lg:col-span-1">Order ID</div>
        <div className="col-span-3 sm:col-span-2 lg:col-span-1">Date</div>
        <div className="col-span-3 sm:col-span-3 lg:col-span-2">Customer</div>
        <div className="hidden lg:block lg:col-span-3">Products</div>
        <div className="col-span-2 sm:col-span-2 lg:col-span-1 text-right">Total</div>
        <div className="hidden lg:block lg:col-span-1 text-right">Paid</div>
        <div className="hidden lg:block lg:col-span-1 text-right">Discount</div>
        <div className="hidden sm:block sm:col-span-2 lg:col-span-1 text-center">Status</div>
        <div className="col-span-1 text-right lg:text-center">Action</div>
      </div>

      {/* Orders List */}
      <div className='w-full flex flex-col gap-2.5'>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white animate-pulse rounded-xs border border-slate-200"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
             <p className='text-slate-600 font-semibold'>No Returned Orders Found</p>
             <p className='text-slate-400 text-sm mt-1'>Everything looks good!</p>
          </div>
        ) : filteredOrders.map((order) => {
          const isMenuOpen = openMenuId === order.order_id
          const isDeleting = confirmDelete === order.order_id
          const productList = order.product_list || order.items || []

          return (
            <div 
              key={order.order_id} 
              className={`w-full border border-slate-200 rounded-xs shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-3 sm:p-4 lg:py-3 lg:px-5 relative ${
                isMenuOpen ? 'z-50' : 'z-1'
              }`}
            >
              <div className='grid grid-cols-12 gap-2 sm:gap-3 items-center'>
                
                {/* 1. Order ID */}
                <div className='col-span-3 sm:col-span-2 lg:col-span-1 flex items-center justify-start gap-1 sm:gap-2'>
                  <span className='text-xs font-mono font-bold text-slate-900 bg-slate-100 px-1.5 sm:px-2 py-1 rounded-md truncate'>
                    #{order.order_id}
                  </span>
                </div>

                {/* 2. Date */}
                <div className='col-span-3 sm:col-span-2 lg:col-span-1 text-[11px] sm:text-xs text-slate-600 font-medium truncate'>
                  {formatDate(order.created_at || order.date)}
                </div>

                {/* 3. Customer */}
                <div className='col-span-3 sm:col-span-3 lg:col-span-2 flex flex-col justify-center min-w-0'>
                  <p className='font-bold text-slate-800 text-xs truncate' title={order.name || 'Walk-in Customer'}>
                    {order.name || 'Walk-in Customer'}
                  </p>
                  <p className='text-[10px] sm:text-[11px] text-slate-500 font-mono truncate'>
                    {order.phone || 'N/A'}
                  </p>
                </div>

                {/* 4. Products */}
                <div className='hidden lg:flex lg:col-span-3 flex-col justify-center'>
                  <div className='flex flex-col gap-1 py-0.5'>
                    {productList.length > 0 ? (
                      productList.map((prod, idx) => (
                        <div key={idx} className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5 leading-snug">
                          <span className="text-sky-600 font-bold bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                            x{prod.quantity}
                          </span>
                          <span className="truncate" title={prod.name}>
                            {prod.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No products</span>
                    )}
                  </div>
                </div>

                {/* 5. Total */}
                <div className='col-span-2 sm:col-span-2 lg:col-span-1 text-right text-xs font-bold text-slate-900'>
                  ৳{Number(order.total_amount || 0).toLocaleString()}
                </div>

                {/* 6. Paid */}
                <div className='hidden lg:block lg:col-span-1 text-right font-bold text-rose-500 text-xs'>
                  ৳{Number(order.paid_amount || order.amount_received || 0).toLocaleString()}
                </div>

                {/* 7. Discount */}
                <div className='hidden lg:block lg:col-span-1 text-right font-bold text-rose-500 text-xs'>
                  ৳{Number(order.discount || order.total_discount_amount || 0).toLocaleString()}
                </div>

                {/* 8. Status */}
                <div className='hidden sm:flex sm:col-span-2 lg:col-span-1 items-center justify-center'>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                    Returned
                  </span>
                </div>

                {/* 9. Action */}
                <div className='col-span-1 flex items-center justify-end lg:justify-center relative'>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setConfirmDelete(null)
                        setOpenMenuId(isMenuOpen ? null : order.order_id)
                      }}
                      className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Actions"
                    >
                      <BsThreeDotsVertical size={16} />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 z-40 bg-white border border-slate-200 shadow-xl rounded-xs p-1.5 w-44 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                        {isDeleting ? (
                          <div className="p-2 flex flex-col gap-2 bg-rose-50 rounded-lg text-center">
                            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Confirm Delete?</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => deleteOrder(order.order_id)}
                                className="flex-1 bg-rose-500 text-white text-xs font-bold py-1.5 rounded-md hover:bg-rose-600 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <FaCheck size={12} /> Yes
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 bg-slate-200 text-slate-700 text-xs font-bold py-1.5 rounded-md hover:bg-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <FaXmark size={12} /> No
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Link
                              href={`/dashboard/pos/${order.order_id}`}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-sky-600 hover:bg-sky-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <GoEye size={16} /> View Invoice
                            </Link>

                            <button
                              onClick={() => {
                                setOpenMenuId(null)
                                printOrder(order)
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <IoPrintOutline size={16} /> Print Receipt
                            </button>

                            <button
                              onClick={() => setConfirmDelete(order.order_id)}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-100 mt-0.5 pt-2"
                            >
                              <MdDelete size={16} /> Delete Order
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReturnedOrdersPage

