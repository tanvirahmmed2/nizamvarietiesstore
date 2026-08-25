'use client'
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { 
  RiHistoryLine, 
  RiTruckLine, 
  RiSearchLine, 
  RiRefreshLine, 
  RiShoppingBag3Line, 
  RiArrowLeftLine,
  RiCheckLine,
  RiExchangeDollarLine,
  RiFilter3Line,
  RiCornerUpLeftLine,
  RiTimeLine
} from 'react-icons/ri'
import Link from 'next/link'

export default function ReturnPurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'completed', 'returned', 'pending'
  const [suppliers, setSuppliers] = useState([])
  const [returningId, setReturningId] = useState(null)
  const [selectedPurchaseToReturn, setSelectedPurchaseToReturn] = useState(null)

  const fetchPurchases = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/purchase')
      if (res.data.success) {
        setPurchases(res.data.payload || [])
      } else {
        setPurchases([])
      }
    } catch (err) {
      console.error('Error fetching purchases:', err)
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await axios.get('/api/supplier')
      if (res.data.success) {
        setSuppliers(res.data.payload || [])
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err)
    }
  }, [])

  useEffect(() => {
    fetchPurchases()
    fetchSuppliers()
  }, [fetchPurchases, fetchSuppliers])

  const handleReturnPurchase = async (purchaseId) => {
    setReturningId(purchaseId)
    try {
      const res = await axios.post(`/api/purchase/${purchaseId}/return`)
      if (res.data.success) {
        toast.success(res.data.message || `Purchase #${purchaseId} marked as returned & stock decreased`)
        setSelectedPurchaseToReturn(null)
        fetchPurchases()
      } else {
        toast.error(res.data.message || 'Failed to return purchase')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing purchase return')
    } finally {
      setReturningId(null)
    }
  }

  const filteredPurchases = purchases.filter(p => {
    const term = searchTerm.toLowerCase()
    const matchId = String(p.purchase_id || '').toLowerCase().includes(term)
    const matchSupplier = String(p.supplier_name || p.supplier || '').toLowerCase().includes(term)
    const matchInvoice = String(p.invoice_no || '').toLowerCase().includes(term)
    const matchProduct = String(p.items?.map(i => i.name).join(' ') || '').toLowerCase().includes(term)
    
    const matchesSearch = matchId || matchSupplier || matchInvoice || matchProduct

    const pStatus = p.status || 'completed'
    const matchesStatus = statusFilter === 'all' || pStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const returnedPurchases = purchases.filter(p => (p.status || 'completed') === 'returned')
  const completedPurchases = purchases.filter(p => (p.status || 'completed') === 'completed')

  const totalReturnCount = returnedPurchases.length
  const totalReturnVal = returnedPurchases.reduce((acc, p) => acc + (parseFloat(p.total_amount) || 0), 0)

  return (
    <div className="w-full space-y-6">

      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <RiHistoryLine size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Purchase Returns & Status</h1>
            <p className="text-xs text-slate-400 font-medium">Manage purchase orders, return supplier stock & audit return logs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPurchases}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Data"
          >
            <RiRefreshLine size={18} />
          </button>
          <Link
            href="/dashboard/purchase-list"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <RiShoppingBag3Line size={16} />
            <span>All Purchases</span>
          </Link>
        </div>
      </div>

      {/* ── Summary Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <RiCornerUpLeftLine size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Returned Purchases</p>
            <p className="text-xl font-black text-slate-900">{totalReturnCount} Orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <RiExchangeDollarLine size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Returned Stock Value</p>
            <p className="text-xl font-black text-slate-900">৳ {totalReturnVal.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <RiShoppingBag3Line size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Purchases</p>
            <p className="text-xl font-black text-slate-900">{completedPurchases.length} Active</p>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ───────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl focus-within:border-slate-900 focus-within:bg-white transition-all">
          <RiSearchLine className="text-slate-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search by purchase ID, invoice #, supplier, or item name..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-slate-900"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed Purchases</option>
            <option value="returned">Returned Purchases</option>
            <option value="pending">Pending Purchases</option>
          </select>
        </div>
      </div>

      {/* ── Purchases Table ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-bold">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent mx-auto mb-3"></div>
            Loading purchase records...
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <RiHistoryLine size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700 text-sm">No Purchases Found</p>
            <p className="mt-1 text-slate-400">Try adjusting your search query or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Purchase ID</th>
                  <th className="py-3.5 px-4">Invoice / Date</th>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4">Purchased Items</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredPurchases.map((purchase) => {
                  const pStatus = purchase.status || 'completed'
                  const isReturned = pStatus === 'returned'
                  const isPending = pStatus === 'pending'
                  const isCompleted = pStatus === 'completed'

                  return (
                    <tr key={purchase.purchase_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #{purchase.purchase_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold block text-slate-800">
                          {purchase.invoice_no ? `INV: ${purchase.invoice_no}` : 'N/A'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {purchase.created_at ? new Date(purchase.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <div className="flex items-center gap-2">
                          <RiTruckLine className="text-slate-400 shrink-0" size={15} />
                          <span>{purchase.supplier_name || 'General Supplier'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        {purchase.items && purchase.items.length > 0 ? (
                          purchase.items.map(i => `${i.name} (x${i.quantity})`).join(', ')
                        ) : (
                          'No items logged'
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        ৳ {Number(purchase.total_amount || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isReturned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <RiCornerUpLeftLine size={12} />
                            <span>Returned</span>
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                            <RiTimeLine size={12} />
                            <span>Pending</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <RiCheckLine size={12} />
                            <span>Completed</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isCompleted && (
                          <button
                            onClick={() => setSelectedPurchaseToReturn(purchase)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                          >
                            <RiCornerUpLeftLine size={14} />
                            <span>Return Purchase</span>
                          </button>
                        )}
                        {isReturned && (
                          <span className="text-[11px] font-semibold text-slate-400 italic">
                            Returned & Stock Reduced
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Confirm Return Modal ──────────────────────────────────────── */}
      {selectedPurchaseToReturn && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center font-bold shrink-0">
                <RiCornerUpLeftLine size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Return Purchase #{selectedPurchaseToReturn.purchase_id}</h3>
                <p className="text-xs text-slate-500">Confirm returning goods to supplier</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Supplier:</span>
                <span className="font-bold">{selectedPurchaseToReturn.supplier_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Invoice:</span>
                <span className="font-mono">{selectedPurchaseToReturn.invoice_no || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Total Value:</span>
                <span className="font-black text-slate-900">৳ {Number(selectedPurchaseToReturn.total_amount || 0).toFixed(2)}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Items to reduce from stock:</p>
                <ul className="space-y-1">
                  {selectedPurchaseToReturn.items?.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-[11px] font-medium">
                      <span>• {item.name}</span>
                      <span className="font-bold text-rose-600">-{item.quantity} units</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-800 text-[11px] leading-relaxed">
              ⚠️ <strong>Warning:</strong> Mark as returned will automatically reduce the product stock balance for all items listed above.
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPurchaseToReturn(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={returningId === selectedPurchaseToReturn.purchase_id}
                onClick={() => handleReturnPurchase(selectedPurchaseToReturn.purchase_id)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                {returningId === selectedPurchaseToReturn.purchase_id ? 'Processing Return...' : 'Confirm Return & Reduce Stock'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
