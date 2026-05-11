'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaSearch, FaFileInvoiceDollar, FaCalendarAlt, FaBoxOpen } from 'react-icons/fa'

const PurchasePaymentsPage = () => {
    const [payments, setPayments] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchPayments = async () => {
        try {
            const res = await axios.get(`/api/purchase-payment?q=${searchTerm}`)
            if (res.data.success) {
                setPayments(res.data.payload)
            }
        } catch (error) {
            setPayments([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => fetchPayments(), 300)
        return () => clearTimeout(delayDebounce)
    }, [searchTerm])

    return (
        <div className='w-full min-h-screen flex flex-col items-center p-1 sm:p-4 gap-6 bg-gray-50'>
            <div className='flex items-center gap-3'>
                <FaFileInvoiceDollar className='text-3xl text-sky-600' />
                <h1 className='text-3xl font-black text-gray-800 uppercase tracking-tighter'>Purchase Payments</h1>
            </div>

            {/* Search Bar */}
            <div className='w-full  flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-sm'>
                <FaSearch className='text-gray-400' />
                <input
                    type="text"
                    placeholder="Search by supplier or invoice..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full outline-none p-2 text-gray-700 bg-transparent'
                />
            </div>

            <div className='w-full grid grid-cols-6 gap-2 bg-sky-500 text-white p-2'>
                <p>Date</p>
                <p>Name</p>
                <p>Invoice No</p>
                <p>Product Number</p>
                <p>Paid Amount</p>
                <p>Method</p>

            </div>

            <div className='w-full  flex flex-col gap-3'>
                {loading ? (
                    <p className='text-center py-10 text-gray-400 font-bold animate-pulse'>Loading Records...</p>
                ) : payments.length > 0 ? (
                    payments.map((p) => (
                        <div
                            key={p.payment_id}
                            className='w-full grid grid-cols-6 gap-2 even:bg-slate-200 p-2 '
                        >
                            <p>{p.date.slice(0, 10)}</p>
                            
                            <p>{p.supplier_name}</p>

                            <p> {p.invoice_no || 'N/A'}</p>
                            <p> {p.total_products} </p>
                            <p>৳{Number(p.paid_amount).toLocaleString()}</p>
                            <p>{p.payment_method}</p>
                        </div>
                    ))
                ) : (
                    <p className='text-center py-20 text-gray-400 font-medium'>No payment history found matching your search.</p>
                )}
            </div>
        </div>
    )
}

export default PurchasePaymentsPage
