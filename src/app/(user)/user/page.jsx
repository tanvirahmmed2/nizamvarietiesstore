'use client'
import React, { useEffect, useState } from 'react'
import { User, Mail, Phone, Calendar, ShoppingBag, Settings, ArrowRight, Package, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

export default function UserOverviewPage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          axios.get('/api/user/islogin', { withCredentials: true }),
          axios.get('/api/user/order', { withCredentials: true }).catch(() => null)
        ])

        if (userRes.data?.success) {
          setUser(userRes.data.payload)
        }
        if (orderRes?.data?.success) {
          setOrders(orderRes.data.payload || [])
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return null

  const totalOrders = orders.length
  const completedOrders = orders.filter(o => o.order_status?.toLowerCase() === 'completed' || o.order_status?.toLowerCase() === 'confirm').length
  const pendingOrders = orders.filter(o => o.order_status?.toLowerCase() === 'pending').length
  const recentOrders = orders.slice(0, 3)

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-black text-slate-900">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Orders</p>
            <p className="text-2xl font-black text-slate-900">{pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-slate-900">{completedOrders}</p>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Content Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card & Account Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Account Summary</h2>
                <p className="text-xs text-slate-400 font-medium">Personal info and member credentials</p>
              </div>
              <Link
                href="/user/settings"
                className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1 underline underline-offset-4"
              >
                Edit Details
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</p>
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <User size={15} className="text-slate-400" />
                  <span>{user?.name || '—'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</p>
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800 truncate">
                  <Mail size={15} className="text-slate-400 shrink-0" />
                  <span className="truncate">{user?.email || '—'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</p>
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <Phone size={15} className="text-slate-400" />
                  <span>{user?.phone || '—'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Member Since</p>
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <Calendar size={15} className="text-slate-400" />
                  <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Recent Purchases</h2>
                <p className="text-xs text-slate-400 font-medium">Your latest orders status</p>
              </div>
              <Link
                href="/user/orders"
                className="text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Explore our catalog to start shopping.</p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div
                    key={order.order_id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Order #{order.order_id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.order_status?.toLowerCase() === 'completed' || order.order_status?.toLowerCase() === 'confirm'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.order_status?.toLowerCase() === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {order.order_status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} items
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="font-black text-slate-900 text-sm">৳ {Number(order.total_amount).toFixed(2)}</span>
                      <Link
                        href="/user/orders"
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Shortcut Column */}
        <div className="space-y-4">
          <Link href="/user/profile" className="block group">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-slate-900 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <User size={20} />
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Profile Details</h3>
              <p className="text-xs text-slate-400 mt-0.5">View your complete personal and account info.</p>
            </div>
          </Link>

          <Link href="/user/orders" className="block group">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-slate-900 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <ShoppingBag size={20} />
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Orders & History</h3>
              <p className="text-xs text-slate-400 mt-0.5">Track active packages and view purchase history.</p>
            </div>
          </Link>

          <Link href="/user/settings" className="block group">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-slate-900 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Settings size={20} />
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Account Settings</h3>
              <p className="text-xs text-slate-400 mt-0.5">Update name, phone, email, or change password.</p>
            </div>
          </Link>
        </div>

      </div>

    </div>
  )
}
