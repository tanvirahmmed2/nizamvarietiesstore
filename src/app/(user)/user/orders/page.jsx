'use client'
import React, { useEffect, useState } from 'react'
import { Package, Clock, CheckCircle2, XCircle, CreditCard, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/user/order', { withCredentials: true })
        if (res.data?.success) {
          setOrders(res.data.payload || [])
        } else {
          toast.error(res.data?.message || 'Failed to load orders')
        }
      } catch (err) {
        if (err.response?.status === 401) {
          window.location.replace('/login')
        } else {
          toast.error('Error loading order history')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent mx-auto mb-3"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading order history...</p>
      </div>
    )
  }

  // Filter logic
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true
    const st = order.order_status?.toLowerCase() || 'pending'
    if (activeFilter === 'pending') return st === 'pending'
    if (activeFilter === 'completed') return st === 'completed' || st === 'confirm'
    if (activeFilter === 'cancelled') return st === 'cancelled' || st === 'returned'
    return true
  })

  const getStatusBadge = (status) => {
    const st = status?.toLowerCase()
    switch (st) {
      case 'completed':
      case 'confirm':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={13} />
            <span className="uppercase tracking-wider">{status}</span>
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={13} />
            <span className="uppercase tracking-wider">Pending</span>
          </span>
        )
      case 'cancelled':
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle size={13} />
            <span className="uppercase tracking-wider">{status}</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <Package size={13} />
            <span className="uppercase tracking-wider">{status || 'Processing'}</span>
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Filters & Title ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Purchase History</h2>
          <p className="text-xs text-slate-400 font-medium">Track your placed orders and delivery status</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {['all', 'pending', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                activeFilter === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders List ────────────────────────────────────────────────── */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Orders Found</h3>
          <p className="text-xs text-slate-400 mb-6">
            {activeFilter === 'all'
              ? "You haven't placed any orders yet."
              : `No ${activeFilter} orders found.`}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.order_id
            return (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all"
              >
                {/* Order Summary Top Bar */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Order ID</p>
                      <p className="font-black text-slate-900 text-sm">#{order.order_id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date Placed</p>
                      <p className="font-bold text-slate-800">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Amount</p>
                      <p className="font-black text-slate-900 text-sm">৳ {Number(order.total_amount).toFixed(2)}</p>
                    </div>
                    {order.payment && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Payment</p>
                        <p className="font-bold text-slate-800 flex items-center gap-1 capitalize">
                          <CreditCard size={13} className="text-slate-400" />
                          <span>{order.payment.method} ({order.payment.status})</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {getStatusBadge(order.order_status)}

                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.order_id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Items List (Always visible summary + Expandable items) */}
                <div className="p-5">
                  <div className="space-y-3">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0"
                      >
                        <div className="w-14 h-14 rounded-xl border border-slate-200/80 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-slate-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Unit: {item.unit || 'Standard'}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-bold text-xs text-slate-700">Qty: {item.quantity}</p>
                          <p className="font-black text-slate-900 text-sm mt-0.5">
                            ৳ {Number(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Details Drawer */}
                  {isExpanded && order.payment && (
                    <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 rounded-xl p-4 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-bold">Transaction ID:</span>
                        <span className="font-mono text-slate-800 font-bold">{order.payment.transaction_id || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-bold">Payment Method:</span>
                        <span className="font-bold text-slate-800 uppercase">{order.payment.method}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-bold">Payment Status:</span>
                        <span className="font-bold text-slate-800 capitalize">{order.payment.status}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
