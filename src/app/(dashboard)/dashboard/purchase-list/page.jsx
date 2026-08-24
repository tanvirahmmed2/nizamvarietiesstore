'use client'
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { FaBarcode, FaCheck, FaXmark } from 'react-icons/fa6'
import { printPurchaseInvoice } from '@/lib/database/printPurchaseInvoice'
import Link from 'next/link'
import { GoEye } from 'react-icons/go'
import { IoPrintOutline } from 'react-icons/io5'
import { MdDelete } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'

const PurchaseList = () => {
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [openMenuId, setOpenMenuId] = useState(null)

    const fetchPurchases = useCallback(async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/purchase?q=${searchTerm}`)
            if (res.data.success) setPurchases(res.data.payload || [])
        } catch (error) {
            setPurchases([])
        } finally {
            setLoading(false)
        }
    }, [searchTerm])

    useEffect(() => {
        const handler = setTimeout(() => fetchPurchases(), 300)
        return () => clearTimeout(handler)
    }, [fetchPurchases])

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete('/api/purchase', { data: { id } })
            if (res.data.success) {
                toast.success("Purchase deleted and stock reverted")
                setConfirmDelete(null)
                setOpenMenuId(null)
                fetchPurchases()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed")
        }
    }

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
            {openMenuId !== null && (
                <div 
                    className="fixed inset-0 z-30 bg-transparent cursor-default" 
                    onClick={() => setOpenMenuId(null)} 
                />
            )}

            {/* Header */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
                <div>
                    <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Purchase History</h1>
                    <p className='text-sm text-slate-500 mt-1'>View and manage product purchase orders</p>
                </div>
                <div className='w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
                    {purchases.length > 0 && (
                        <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 px-3 py-2.5 rounded-xs text-center whitespace-nowrap border border-sky-100">
                            Total: {purchases.length} Purchases
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
                <div className="col-span-3 sm:col-span-2 lg:col-span-1">Inv / ID</div>
                <div className="col-span-3 sm:col-span-2 lg:col-span-1">Date</div>
                <div className="col-span-3 sm:col-span-3 lg:col-span-2">Supplier</div>
                <div className="hidden lg:block lg:col-span-3">Products</div>
                <div className="col-span-2 sm:col-span-2 lg:col-span-1 text-right">Gross</div>
                <div className="hidden lg:block lg:col-span-2 text-right">Total Paid</div>
                <div className="hidden sm:block sm:col-span-2 lg:col-span-1 text-center">Status</div>
                <div className="col-span-1 text-right lg:text-center">Action</div>
            </div>

            {/* Purchases List */}
            <div className='w-full flex flex-col gap-2.5'>
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-white animate-pulse rounded-xs border border-slate-200"></div>
                        ))}
                    </div>
                ) : purchases.length === 0 ? (
                    <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
                        <p className='text-slate-600 font-semibold'>No Purchase Orders Found</p>
                        <p className='text-slate-400 text-sm mt-1'>Try adjusting your search query.</p>
                    </div>
                ) : purchases.map((purchase) => {
                    const isMenuOpen = openMenuId === purchase.purchase_id
                    const isDeleting = confirmDelete === purchase.purchase_id
                    const itemsList = purchase.items || []

                    return (
                        <div 
                            key={purchase.purchase_id} 
                            className={`w-full border border-slate-200 rounded-xs shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-3 sm:p-4 lg:py-3 lg:px-5 relative ${
                                isMenuOpen ? 'z-50' : 'z-1'
                            }`}
                        >
                            <div className='grid grid-cols-12 gap-2 sm:gap-3 items-center'>
                                
                                {/* 1. Inv / ID */}
                                <div className='col-span-3 sm:col-span-2 lg:col-span-1 flex items-center justify-start gap-1 sm:gap-2'>
                                    <span className='text-xs font-mono font-bold text-slate-900 bg-slate-100 px-1.5 sm:px-2 py-1 rounded-md truncate' title={purchase.invoice_no || purchase.purchase_id}>
                                        {purchase.invoice_no ? `INV:${purchase.invoice_no}` : `#${purchase.purchase_id}`}
                                    </span>
                                </div>

                                {/* 2. Date */}
                                <div className='col-span-3 sm:col-span-2 lg:col-span-1 text-[11px] sm:text-xs text-slate-600 font-medium truncate'>
                                    {formatDate(purchase.created_at)}
                                </div>

                                {/* 3. Supplier */}
                                <div className='col-span-3 sm:col-span-3 lg:col-span-2 flex flex-col justify-center min-w-0'>
                                    <p className='font-bold text-slate-800 text-xs truncate' title={purchase.supplier_name}>
                                        {purchase.supplier_name}
                                    </p>
                                    <p className='text-[10px] sm:text-[11px] text-slate-500 font-mono truncate'>
                                        {purchase.supplier_phone || 'N/A'}
                                    </p>
                                </div>

                                {/* 4. Products */}
                                <div className='hidden lg:flex lg:col-span-3 flex-col justify-center'>
                                    <div className='flex flex-col gap-1 py-0.5'>
                                        {itemsList.length > 0 ? (
                                            itemsList.map((item, i) => (
                                                <div key={i} className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5 leading-snug">
                                                    <span className="text-sky-600 font-bold bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                                                        x{item.quantity}
                                                    </span>
                                                    <span className="truncate" title={item.name}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-[11px] text-slate-400 italic">No products</span>
                                        )}
                                    </div>
                                </div>

                                {/* 5. Gross */}
                                <div className='col-span-2 sm:col-span-2 lg:col-span-1 text-right text-xs font-bold text-slate-900'>
                                    ৳{Number(purchase.subtotal_amount || 0).toLocaleString()}
                                </div>

                                {/* 6. Total Paid */}
                                <div className='hidden lg:block lg:col-span-2 text-right font-bold text-emerald-600 text-xs'>
                                    ৳{Number(purchase.total_amount || 0).toLocaleString()}
                                </div>

                                {/* 7. Status */}
                                <div className='hidden sm:flex sm:col-span-2 lg:col-span-1 items-center justify-center'>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                                        Received
                                    </span>
                                </div>

                                {/* 8. Action */}
                                <div className='col-span-1 flex items-center justify-end lg:justify-center relative'>
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setConfirmDelete(null)
                                                setOpenMenuId(isMenuOpen ? null : purchase.purchase_id)
                                            }}
                                            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                            title="Actions"
                                        >
                                            <BsThreeDotsVertical size={16} />
                                        </button>

                                        {isMenuOpen && (
                                            <div className="absolute right-0 top-full mt-1 z-40 bg-white border border-slate-200 shadow-xl rounded-xs p-1.5 w-44 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                                                {isDeleting ? (
                                                    <div className="p-2 flex flex-col gap-2 bg-rose-50 rounded-lg text-center">
                                                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Revert Stock & Delete?</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleDelete(purchase.purchase_id)}
                                                                className="flex-1 bg-rose-500 text-white text-xs font-bold py-1.5 rounded-md hover:bg-rose-600 flex items-center justify-center gap-1 cursor-pointer"
                                                            >
                                                                <FaCheck size={12} /> Yes
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDelete(null)}
                                                                className="flex-1 bg-slate-200 text-slate-700 text-xs font-bold py-1.5 rounded-md hover:bg-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                                                            >
                                                                <FaXmark size={12} /> No
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Link
                                                            href={`/dashboard/purchase/${purchase.purchase_id}`}
                                                            className="w-full text-left px-3 py-2 text-xs font-semibold text-sky-600 hover:bg-sky-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                                                        >
                                                            <GoEye size={16} /> View Details
                                                        </Link>

                                                        <button
                                                            onClick={() => {
                                                                setOpenMenuId(null)
                                                                printPurchaseInvoice(purchase)
                                                            }}
                                                            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                                                        >
                                                            <IoPrintOutline size={16} /> Print Invoice
                                                        </button>

                                                        <button
                                                            onClick={() => setConfirmDelete(purchase.purchase_id)}
                                                            className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-100 mt-0.5 pt-2"
                                                        >
                                                            <MdDelete size={16} /> Delete Purchase
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PurchaseList

