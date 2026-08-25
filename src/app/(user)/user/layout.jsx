'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, ShoppingBag, Settings, LayoutDashboard, LogOut, Loader2, ShieldCheck } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function UserSubLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/islogin', { withCredentials: true })
        if (res.data.success) {
          setUser(res.data.payload)
        } else {
          router.push('/login')
        }
      } catch (err) {
        toast.error('Session expired. Please login again.')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await axios.get('/api/user/login', { withCredentials: true })
      toast.success('Logged out successfully')
      window.location.replace('/login')
    } catch {
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-slate-50/50">
        <Loader2 className="animate-spin text-slate-800 mb-3" size={32} />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Account...</p>
      </div>
    )
  }

  if (!user) return null

  const navItems = [
    { href: '/user', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/user/profile', label: 'Profile Info', icon: User },
    { href: '/user/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/user/settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="w-full min-h-screen bg-slate-50/60 pb-20 pt-4 sm:pt-6">
      <div className="w-full px-4 sm:px-6">

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md border-2 border-white">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900">{user.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <ShieldCheck size={12} /> Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{user.email} • {user.phone}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all border border-red-100 active:scale-95 self-end sm:self-auto"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

        {/* ── Navigation Tabs ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200/80 mb-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* ── Page Content ─────────────────────────────────────────────── */}
        <div>{children}</div>
      </div>
    </div>
  )
}
