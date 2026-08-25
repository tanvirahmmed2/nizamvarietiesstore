'use client'
import React, { useEffect, useState, useContext } from 'react'
import { User, Mail, Phone, Lock, Save, Loader2, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Context } from '@/components/helper/Context'

export default function UserSettingsPage() {
  const { setUserData } = useContext(Context) || {}
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/islogin', { withCredentials: true })
        if (res.data?.success) {
          const u = res.data.payload
          setUser(u)
          setFormData(prev => ({
            ...prev,
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || ''
          }))
        }
      } catch (err) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setSaving(true)
    try {
      const payload = {
        user_id: user.user_id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }

      if (formData.password) {
        payload.password = formData.password
      }

      const res = await axios.put('/api/user', payload)

      if (res.status === 200) {
        toast.success(res.data?.message || 'Profile updated successfully!')
        const updatedUser = res.data?.user || payload
        setUser(updatedUser)
        if (setUserData) setUserData(updatedUser)

        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
      } else {
        toast.error(res.data?.message || 'Failed to update profile')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
        <Loader2 className="animate-spin text-slate-800 mx-auto mb-3" size={24} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">Account & Profile Settings</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage your personal information and account security</p>
          </div>
          <Shield size={22} className="text-slate-400 hidden sm:block" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* ── Personal Info Section ─────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Personal Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-semibold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-semibold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-semibold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Security Section ──────────────────────────────────────── */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Security & Password
            </h3>
            <p className="text-xs text-slate-400">Leave password fields empty if you do not want to update your password.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-semibold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-semibold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Save Action ────────────────────────────────────────────── */}
          <div className="pt-4 flex items-center justify-end border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl shadow-sm text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              <span>Save Changes</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  )
}
