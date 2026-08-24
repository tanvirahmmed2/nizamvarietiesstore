'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaBarcode } from 'react-icons/fa'

const PurchasePaymentsPage = () => {
    const [payments, setPayments] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchPayments = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/purchase-payment?q=${searchTerm}`)
            if (res.data.success) {
                setPayments(res.data.payload || [])
            } else {
                setPayments([])
            }
        } catch (error) {
            console.error("Fetch purchase payments error:", error)
            setPayments([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => fetchPayments(), 300)
        return () => clearTimeout(delayDebounce)
    }, [searchTerm])

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
            
            {/* Header */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
                <div>
                    <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Purchase Transactions</h1>
                    <p className='text-sm text-slate-500 mt-1'>View and track supplier payment records</p>
                </div>
                <div className='w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
                    {payments.length > 0 && (
                        <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 px-3 py-2.5 rounded-xs text-center whitespace-nowrap border border-sky-100">
                            Total: {payments.length} Payments
                        </span>
                    )}
                    <div className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xs border border-slate-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100/50 transition-all sm:w-72'>
                        <FaBarcode className='text-slate-400 text-lg' />
                        <input
                            type="text"
                            placeholder="Search by supplier or invoice..."
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
                <div className="col-span-3 sm:col-span-2 lg:col-span-2">Invoice No</div>
                <div className="col-span-4 sm:col-span-4 lg:col-span-3">Supplier Name</div>
                <div className="hidden lg:block lg:col-span-2 text-center">Products</div>
                <div className="hidden sm:block sm:col-span-2 lg:col-span-1 text-center">Method</div>
                <div className="col-span-2 sm:col-span-2 lg:col-span-2 text-right">Paid Amount</div>
            </div>

            {/* Payments List */}
            <div className='w-full flex flex-col gap-2.5'>
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-white animate-pulse rounded-xs border border-slate-200"></div>
                        ))}
                    </div>
                ) : payments.length === 0 ? (
                    <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
                        <p className='text-slate-600 font-semibold'>No Payment Records Found</p>
                        <p className='text-slate-400 text-sm mt-1'>Try adjusting your search query.</p>
                    </div>
                ) : payments.map((p, idx) => (
                    <div
                        key={p.payment_id || idx}
                        className='w-full border border-slate-200 rounded-xs shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-3 sm:p-4 lg:py-3 lg:px-5 bg-white'
                    >
                        <div className='grid grid-cols-12 gap-2 sm:gap-3 items-center'>
                            
                            {/* 1. Date */}
                            <div className='col-span-3 sm:col-span-2 lg:col-span-2 text-[11px] sm:text-xs text-slate-600 font-medium truncate'>
                                {formatDate(p.date)}
                            </div>

                            {/* 2. Invoice No */}
                            <div className='col-span-3 sm:col-span-2 lg:col-span-2 flex items-center justify-start gap-1 sm:gap-2'>
                                <span className='text-xs font-mono font-bold text-slate-900 bg-slate-100 px-1.5 sm:px-2 py-1 rounded-md truncate' title={p.invoice_no}>
                                    {p.invoice_no ? `INV:${p.invoice_no}` : 'N/A'}
                                </span>
                            </div>

                            {/* 3. Supplier Name */}
                            <div className='col-span-4 sm:col-span-4 lg:col-span-3 flex flex-col justify-center min-w-0'>
                                <p className='font-bold text-slate-800 text-xs truncate' title={p.supplier_name}>
                                    {p.supplier_name || 'Unknown Supplier'}
                                </p>
                            </div>

                            {/* 4. Products */}
                            <div className='hidden lg:flex lg:col-span-2 items-center justify-center'>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">
                                    {p.total_products ? `${p.total_products} Items` : 'N/A'}
                                </span>
                            </div>

                            {/* 5. Method */}
                            <div className='hidden sm:flex sm:col-span-2 lg:col-span-1 items-center justify-center'>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-700">
                                    {p.payment_method || 'Cash'}
                                </span>
                            </div>

                            {/* 6. Paid Amount */}
                            <div className='col-span-2 sm:col-span-2 lg:col-span-2 text-right text-xs sm:text-sm font-bold text-emerald-600'>
                                ৳{Number(p.paid_amount || 0).toLocaleString()}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PurchasePaymentsPage

