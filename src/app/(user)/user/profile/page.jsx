'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { User, Mail, Phone, Calendar, ShieldCheck, Settings, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/islogin', { withCredentials: true })
        if (res.data.success) {
          setUser(res.data.payload)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading || !user) return null

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="h-28 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 relative p-6 flex items-end">
          <div className="text-white/80 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Verified Customer Account</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Account ID: #{user.user_id}</p>
            </div>

            <Link
              href="/user/settings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 self-start sm:self-auto"
            >
              <Settings size={14} />
              <span>Edit Settings</span>
            </Link>
          </div>

          {/* ── Info Cards Grid ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Full Name</p>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Email Address</p>
                <p className="text-sm font-bold text-slate-900">{user.email}</p>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Phone Number</p>
                <p className="text-sm font-bold text-slate-900">{user.phone}</p>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Registration Date</p>
                <p className="text-sm font-bold text-slate-900">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Nav Actions ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/user/orders" className="block group">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-slate-900 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Purchase History</h3>
                <p className="text-xs text-slate-400">View orders and delivery details</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
          </div>
        </Link>

        <Link href="/user/settings" className="block group">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-slate-900 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                <Settings size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Security & Settings</h3>
                <p className="text-xs text-slate-400">Change password and contact info</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
          </div>
        </Link>
      </div>

    </div>
  )
}
