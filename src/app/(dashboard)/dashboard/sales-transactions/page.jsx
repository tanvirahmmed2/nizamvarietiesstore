
'use client'
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { FaBarcode } from 'react-icons/fa'

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/payment')
      if (res.data.success) {
        setTransactions(res.data.payload || [])
      } else {
        setTransactions([])
      }
    } catch (error) {
      console.error("Fetch transactions error:", error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const dateObj = new Date(dateStr)
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const filteredTransactions = transactions.filter(t => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return (
      (t.transaction_id || t.payment_id || '').toString().toLowerCase().includes(term) ||
      (t.name || '').toLowerCase().includes(term) ||
      (t.phone || '').toLowerCase().includes(term)
    )
  })

  return (
    <div className='w-full flex flex-col gap-4 bg-slate-50 min-h-screen relative'>
      
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Sales Transactions</h1>
          <p className='text-sm text-slate-500 mt-1'>View and track completed payment transactions</p>
        </div>
        <div className='w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          {transactions.length > 0 && (
            <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 px-3 py-2.5 rounded-xs text-center whitespace-nowrap border border-sky-100">
              Total: {transactions.length} Transactions
            </span>
          )}
          <div className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xs border border-slate-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100/50 transition-all sm:w-72'>
            <FaBarcode className='text-slate-400 text-lg' />
            <input 
              type="text" 
              placeholder="Search by ID, name or phone..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}  
              className='bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400'
            />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 sm:gap-3 px-4 sm:px-5 py-3 bg-white border border-slate-200 rounded-xs font-bold text-slate-500 text-[11px] sm:text-xs uppercase tracking-wider shadow-xs items-center">
        <div className="col-span-3 sm:col-span-2 lg:col-span-2">Date</div>
        <div className="col-span-3 sm:col-span-2 lg:col-span-2">Txn / ID</div>
        <div className="col-span-4 sm:col-span-4 lg:col-span-4">Customer</div>
        <div className="hidden sm:block sm:col-span-2 lg:col-span-1 text-right">Subtotal</div>
        <div className="hidden sm:block sm:col-span-2 lg:col-span-1 text-right">Discount</div>
        <div className="col-span-2 sm:col-span-2 lg:col-span-2 text-right">Paid Amount</div>
      </div>

      {/* Transactions List */}
      <div className='w-full flex flex-col gap-2.5'>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white animate-pulse rounded-xs border border-slate-200"></div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
             <p className='text-slate-600 font-semibold'>No Transactions Found</p>
             <p className='text-slate-400 text-sm mt-1'>Try adjusting your search query.</p>
          </div>
        ) : filteredTransactions.map((t, idx) => (
          <div 
            key={t.payment_id || t.transaction_id || idx} 
            className='w-full border border-slate-200 rounded-xs shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-3 sm:p-4 lg:py-3 lg:px-5 bg-white'
          >
            <div className='grid grid-cols-12 gap-2 sm:gap-3 items-center'>
              
              {/* 1. Date */}
              <div className='col-span-3 sm:col-span-2 lg:col-span-2 text-[11px] sm:text-xs text-slate-600 font-medium truncate'>
                {formatDate(t.date)}
              </div>

              {/* 2. Transaction ID */}
              <div className='col-span-3 sm:col-span-2 lg:col-span-2 flex items-center justify-start gap-1 sm:gap-2'>
                <span className='text-xs font-mono font-bold text-slate-900 bg-slate-100 px-1.5 sm:px-2 py-1 rounded-md truncate' title={t.transaction_id || t.payment_id}>
                  #{t.transaction_id || t.payment_id || 'N/A'}
                </span>
              </div>

              {/* 3. Customer */}
              <div className='col-span-4 sm:col-span-4 lg:col-span-4 flex flex-col justify-center min-w-0'>
                <p className='font-bold text-slate-800 text-xs truncate' title={t.name || 'Walk-in Customer'}>
                  {t.name || 'Walk-in Customer'}
                </p>
                <p className='text-[10px] sm:text-[11px] text-slate-500 font-mono truncate'>
                  {t.phone || 'N/A'}
                </p>
              </div>

              {/* 4. Subtotal */}
              <div className='hidden sm:block sm:col-span-2 lg:col-span-1 text-right text-xs font-medium text-slate-700'>
                ৳{Number(t.subtotal || 0).toLocaleString()}
              </div>

              {/* 5. Discount */}
              <div className='hidden sm:block sm:col-span-2 lg:col-span-1 text-right text-xs font-medium text-rose-500'>
                ৳{Number(t.discount || 0).toLocaleString()}
              </div>

              {/* 6. Paid Amount */}
              <div className='col-span-2 sm:col-span-2 lg:col-span-2 text-right text-xs sm:text-sm font-bold text-emerald-600'>
                ৳{Number(t.payment_amount || t.paid_amount || 0).toLocaleString()}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionsPage

