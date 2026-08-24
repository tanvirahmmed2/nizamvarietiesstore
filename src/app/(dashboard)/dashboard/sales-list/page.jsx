'use client'
import { generateReceipt } from '@/lib/database/print'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState, useCallback } from 'react'
import { FaBarcode } from 'react-icons/fa'
import { FaCheck, FaXmark } from 'react-icons/fa6'
import { GiBackwardTime, GiConfirmed } from 'react-icons/gi'
import { MdDelete } from 'react-icons/md'
import { toast } from 'react-hot-toast'
import { GoEye } from 'react-icons/go'
import { IoPrintOutline } from 'react-icons/io5'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const SalesListPage = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 })

  const fetchOrder = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/order/search?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=20`, { withCredentials: true })
      if (response.data.success) {
        setOrders(response.data.payload || [])
        setPagination(response.data.pagination || { currentPage: page, totalPages: 1, totalItems: 0 })
      } else {
        setOrders([])
        setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 })
      }
    } catch (error) {
      console.error(error?.response?.data?.message)
      setOrders([])
      setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 })
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    const handler = setTimeout(() => fetchOrder(currentPage), 300)
    return () => clearTimeout(handler)
  }, [fetchOrder, currentPage])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  const returnOrder = async (orderId) => {
    setOpenMenuId(null)
    const confirm = window.confirm('Are you sure about returning this order?')
    if (!confirm) return
    try {
      const res = await axios.put('/api/order', { orderId, action: 'return' })
      if (res.data.success) {
        toast.success(res.data.message)
        fetchOrder(currentPage)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Return failed")
    }
  }

  const deleteOrder = async (orderId) => {
    try {
      const res = await axios.put('/api/order', { orderId, action: 'delete' })
      if (res.data.success) {
        toast.success("Order deleted successfully")
        setConfirmDelete(null)
        setOpenMenuId(null)
        fetchOrder(currentPage)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed")
    }
  }

  const confirmOrder = async (orderId) => {
    setOpenMenuId(null)
    try {
      const res = await axios.put('/api/order', { orderId, action: 'confirm' })
      if (res.data.success) {
        toast.success("Order confirmed")
        fetchOrder(currentPage)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Confirmation failed")
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

  return (
    <div className='w-full flex flex-col gap-4 bg-slate-50 min-h-screen relative'>

      {openMenuId !== null && (
        <div
          className="fixed inset-0 z-30 bg-transparent cursor-default"
          onClick={() => setOpenMenuId(null)}
        />
      )}

      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Sales History</h1>
          <p className='text-sm text-slate-500 mt-1'>View and manage sales orders</p>
        </div>
        <div className='w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          {pagination.totalItems > 0 && (
            <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-3 py-2.5 rounded-xs text-center whitespace-nowrap">
              Total: {pagination.totalItems} Orders
            </span>
          )}
          <div className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xs border border-slate-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100/50 transition-all sm:w-72'>
            <FaBarcode className='text-slate-400 text-lg' />
            <input
              type="text"
              placeholder="Search by ID, customer or barcode..."
              value={searchTerm}
              onChange={handleSearchChange}
              className='bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400'
            />
          </div>

        </div>
      </div>

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

      <div className='w-full flex flex-col gap-2.5 '>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white animate-pulse rounded-xs border border-slate-200"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
            <p className='text-slate-600 font-semibold'>No Orders Found</p>
            <p className='text-slate-400 text-sm mt-1'>Try adjusting your search query.</p>
          </div>
        ) : orders.map((order) => {
          const isMenuOpen = openMenuId === order.order_id
          const isDeleting = confirmDelete === order.order_id

          return (
            <div
              key={order.order_id}
              className={`w-full border border-slate-200 rounded-xs shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-3 sm:p-4 lg:py-3 lg:px-5 relative ${isMenuOpen ? 'z-50' : 'z-1'
                }`}
            >
              {/* Multi-column Grid Layout (Single Row on lower & large screens) */}
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

                {/* 3. Customer Number & Name */}
                <div className='col-span-3 sm:col-span-3 lg:col-span-2 flex flex-col justify-center min-w-0'>
                  <p className='font-bold text-slate-800 text-xs truncate' title={order.name || 'Walk-in Customer'}>
                    {order.name || 'Walk-in Customer'}
                  </p>
                  <p className='text-[10px] sm:text-[11px] text-slate-500 font-mono truncate'>
                    {order.phone || 'N/A'}
                  </p>
                </div>

                {/* 4. Products (Hidden on lower screens) */}
                <div className='hidden lg:flex lg:col-span-3 flex-col justify-center'>
                  <div className='flex flex-col gap-1 py-0.5'>
                    {order.items?.length > 0 ? (
                      order.items.map((prod, idx) => (
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

                {/* 5. Total Amount */}
                <div className='col-span-2 sm:col-span-2 lg:col-span-1 text-right text-xs font-bold text-slate-900'>
                  ৳{Number(order.total_amount || 0).toLocaleString()}
                </div>

                {/* 6. Paid Amount (Hidden on lower screens) */}
                <div className='hidden lg:block lg:col-span-1 text-right font-bold text-emerald-600 text-xs'>
                  ৳{Number(order.paid_amount || order.amount_received || 0).toLocaleString()}
                </div>

                {/* 7. Discount (Hidden on lower screens) */}
                <div className='hidden lg:block lg:col-span-1 text-right font-bold text-rose-500 text-xs'>
                  ৳{Number(order.total_discount_amount || 0).toLocaleString()}
                </div>

                {/* 8. Status Column (Hidden on mobile < sm, visible on sm+) */}
                <div className='hidden sm:flex sm:col-span-2 lg:col-span-1 items-center justify-center'>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${order.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      order.status === 'returned' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                        'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                    {order.status || 'Completed'}
                  </span>
                </div>

                {/* 9. Action Column (Three Dot Dropdown Button) */}
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

                    {/* Three-Dot Floating Menu */}
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
                            {order.status === 'pending' && (
                              <button
                                onClick={() => confirmOrder(order.order_id)}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <GiConfirmed size={16} /> Confirm Order
                              </button>
                            )}

                            <Link
                              href={`/dashboard/pos/${order.order_id}`}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-sky-600 hover:bg-sky-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <GoEye size={16} /> View Invoice
                            </Link>

                            <button
                              onClick={() => {
                                setOpenMenuId(null)
                                generateReceipt(order)
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <IoPrintOutline size={16} /> Print Receipt
                            </button>

                            {order.status !== 'returned' && (
                              <button
                                onClick={() => returnOrder(order.order_id)}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <GiBackwardTime size={16} /> Return Goods
                              </button>
                            )}

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

      {/* Pagination Controls */}
      {!loading && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 pt-4 border-t border-slate-200">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed bg-white"
            title="Previous Page"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-1 overflow-x-auto max-w-full">
            {currentPage > 3 && pagination.totalPages > 5 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="w-8 h-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer bg-white"
                >
                  1
                </button>
                <span className="px-1 font-bold text-slate-300 text-xs">...</span>
              </>
            )}

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(num => {
                const total = pagination.totalPages;
                if (total <= 5) return true;
                if (currentPage <= 3) return num <= 5;
                if (currentPage >= total - 2) return num >= total - 4;
                return num >= currentPage - 1 && num <= currentPage + 1;
              })
              .map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === num
                      ? 'bg-primary text-white shadow-xs'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-100 bg-white'
                    }`}
                >
                  {num}
                </button>
              ))}

            {currentPage < pagination.totalPages - 2 && pagination.totalPages > 5 && (
              <>
                <span className="px-1 font-bold text-slate-300 text-xs">...</span>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  className="w-8 h-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer bg-white"
                >
                  {pagination.totalPages}
                </button>
              </>
            )}
          </div>

          <button
            disabled={currentPage === pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed bg-white"
            title="Next Page"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default SalesListPage
