'use client'
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { 
  RiAlertLine, 
  RiSearchLine, 
  RiRefreshLine, 
  RiAddCircleLine, 
  RiFilter3Line,
  RiFileList3Line,
  RiExchangeDollarLine,
  RiStackLine
} from 'react-icons/ri'
import Link from 'next/link'

export default function DamageListPage() {
  const [damageLogs, setDamageLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReason, setSelectedReason] = useState('all')

  const fetchDamageLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/product/damage')
      if (res.data.success) {
        setDamageLogs(res.data.payload || [])
      } else {
        setDamageLogs([])
      }
    } catch (err) {
      console.error('Error fetching damage logs:', err)
      setDamageLogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDamageLogs()
  }, [fetchDamageLogs])

  const filteredLogs = damageLogs.filter(log => {
    const term = searchTerm.toLowerCase()
    const matchSearch = String(log.product_name).toLowerCase().includes(term) || String(log.product_id).includes(term)
    const matchReason = selectedReason === 'all' || log.reason.toLowerCase() === selectedReason.toLowerCase()
    return matchSearch && matchReason
  })

  const totalLoss = filteredLogs.reduce((acc, l) => acc + (parseFloat(l.loss_val) || 0), 0)
  const totalUnits = filteredLogs.reduce((acc, l) => acc + (parseInt(l.quantity) || 0), 0)

  return (
    <div className="w-full space-y-6">

      {/* ── Header Bar ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
            <RiAlertLine size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Damage Withdrawal Logs</h1>
            <p className="text-xs text-slate-400 font-medium">Historical audit of withdrawn damaged stock & loss tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDamageLogs}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Logs"
          >
            <RiRefreshLine size={18} />
          </button>
          <Link
            href="/dashboard/damage"
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <RiAddCircleLine size={16} />
            <span>Withdraw Damaged Stock</span>
          </Link>
        </div>
      </div>

      {/* ── Summary Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <RiExchangeDollarLine size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Loss Impact</p>
            <p className="text-xl font-black text-rose-600">৳ {totalLoss.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <RiStackLine size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Withdrawn Units</p>
            <p className="text-xl font-black text-slate-900">{totalUnits} Units</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <RiFileList3Line size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incidents Recorded</p>
            <p className="text-xl font-black text-slate-900">{filteredLogs.length}</p>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Bar ──────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl focus-within:border-slate-900 focus-within:bg-white transition-all">
          <RiSearchLine className="text-slate-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search by product name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <RiFilter3Line size={16} className="text-slate-400" />
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-slate-900"
          >
            <option value="all">All Withdrawal Reasons</option>
            <option value="expired">Expired</option>
            <option value="physical damage">Physical Damage</option>
            <option value="packaging damaged">Packaging Damaged</option>
            <option value="supplier defect">Supplier Defect</option>
            <option value="lost / stolen">Lost / Stolen</option>
          </select>
        </div>
      </div>

      {/* ── Logs Table ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-bold">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-500 border-t-transparent mx-auto mb-3"></div>
            Loading damage audit records...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <RiAlertLine size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700 text-sm">No Damage Records Found</p>
            <p className="mt-1 text-slate-400">All products are in healthy inventory status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Log #</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Withdrawn Qty</th>
                  <th className="py-3.5 px-4">Loss Value</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #{log.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {log.product_name}
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">
                        Product ID: #{log.product_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {log.reason}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {log.quantity} Units
                    </td>
                    <td className="py-3.5 px-4 font-black text-rose-600">
                      ৳ {Number(log.loss_val).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500">
                      {new Date(log.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
