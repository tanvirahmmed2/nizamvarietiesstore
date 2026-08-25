'use client'

import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import {
  RiCustomerService2Line,
  RiMailLine,
  RiReplyLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiFilter3Line,
  RiTimeLine,
  RiCheckDoubleLine,
  RiCheckboxCircleLine,
  RiArchiveLine,
} from 'react-icons/ri'
import { format } from 'date-fns'

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'replied':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'closed':
      return 'bg-slate-100 text-slate-600 border-slate-200'
    case 'pending':
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200'
  }
}

const SupportPage = () => {
  const [supports, setSupports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const fetchSupport = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/support', { withCredentials: true })
      setSupports(response.data.payload || [])
    } catch (error) {
      console.error("Support fetch error:", error)
      toast.error(error?.response?.data?.message || "Failed to load support messages")
      setSupports([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSupport()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    setActionLoadingId(id)
    try {
      const response = await axios.put('/api/support', { support_id: id, status: newStatus }, { withCredentials: true })
      toast.success(response.data.message || `Status updated to ${newStatus}`)
      setSupports((prev) =>
        prev.map((item) => (item.support_id === id ? { ...item, status: newStatus } : item))
      )
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status")
    } finally {
      setActionLoadingId(null)
    }
  }

  const removeSupport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return
    setActionLoadingId(id)
    try {
      const response = await axios.delete('/api/support', { data: { id }, withCredentials: true })
      toast.success(response.data.message || "Message deleted")
      setSupports((prev) => prev.filter((item) => item.support_id !== id))
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove support message")
    } finally {
      setActionLoadingId(null)
    }
  }

  const filteredSupports = useMemo(() => {
    return supports.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        (item.status || 'pending').toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [supports, searchTerm, statusFilter])

  const stats = useMemo(() => {
    const total = supports.length
    const pending = supports.filter((s) => (s.status || 'pending').toLowerCase() === 'pending').length
    const replied = supports.filter((s) => s.status?.toLowerCase() === 'replied').length
    const closed = supports.filter((s) => s.status?.toLowerCase() === 'closed').length
    return { total, pending, replied, closed }
  }, [supports])

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-10">
      
       
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <RiMailLine size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tickets</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <RiTimeLine size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.pending}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <RiCheckDoubleLine size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Replied</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.replied}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
            <RiCheckboxCircleLine size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Closed</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.closed}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by customer, email, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <RiFilter3Line size={16} />
            <span>Filter Status:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-sm font-semibold outline-none focus:border-sky-500 focus:bg-white cursor-pointer transition-all"
          >
            <option value="all">All Messages</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Support List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Loading support messages...</p>
          </div>
        ) : filteredSupports.length === 0 ? (
          <div className="w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <RiArchiveLine size={32} />
            </div>
            <div>
              <p className="text-slate-600 font-semibold">No Support Messages</p>
              <p className="text-slate-400 text-sm mt-1">
                {searchTerm || statusFilter !== 'all'
                  ? 'No support messages match your search or filter criteria.'
                  : 'Customer inquiries will appear here.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Subject & Message
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSupports.map((item) => {
                  const isBusy = actionLoadingId === item.support_id
                  const formattedDate = item.created_at
                    ? format(new Date(item.created_at), 'MMM dd, yyyy • HH:mm')
                    : 'N/A'

                  return (
                    <tr
                      key={item.support_id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Customer Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                            {item.name ? item.name.substring(0, 2).toUpperCase() : 'CU'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-slate-800 text-sm truncate">
                              {item.name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-slate-500 font-mono truncate">
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Message */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col max-w-md">
                          <span className="font-semibold text-slate-800 text-sm truncate">
                            {item.subject || 'No Subject'}
                          </span>
                          <span className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                            {item.message}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-6">
                        <select
                          disabled={isBusy}
                          value={item.status || 'pending'}
                          onChange={(e) => handleStatusChange(item.support_id, e.target.value)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border outline-none cursor-pointer transition-all ${getStatusBadge(
                            item.status
                          )} ${isBusy ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <option value="pending" className="bg-white text-slate-800 font-medium">
                            Pending
                          </option>
                          <option value="replied" className="bg-white text-slate-800 font-medium">
                            Replied
                          </option>
                          <option value="closed" className="bg-white text-slate-800 font-medium">
                            Closed
                          </option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Reply Button -> Link to /dashboard/support/[id] */}
                          <Link
                            href={`/dashboard/support/${item.support_id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors shadow-xs"
                            title="Reply to message"
                          >
                            <RiReplyLine size={16} />
                            <span>Reply</span>
                          </Link>

                          {/* Delete Button */}
                          <button
                            disabled={isBusy}
                            onClick={() => removeSupport(item.support_id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Message"
                          >
                            <RiDeleteBinLine size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SupportPage
