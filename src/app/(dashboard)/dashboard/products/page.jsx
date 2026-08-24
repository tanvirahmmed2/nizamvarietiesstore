'use client'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { MdDeleteOutline, MdEdit } from 'react-icons/md'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FaBarcode } from 'react-icons/fa'

const ProductListPage = () => {
    const [products, setProducts] = useState([])
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 })
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const loadData = useCallback(async (page = 1, search = '') => {
        setLoading(true)
        try {
            let url = search
                ? `/api/product/search?q=${encodeURIComponent(search)}`
                : `/api/product?page=${page}`;

            const res = await axios.get(url, { withCredentials: true });

            if (res.data.success) {
                setProducts(res.data.payload || [])
                setPagination(res.data.pagination || { currentPage: page, totalPages: 1 })
            }
        } catch (error) {
            console.error("Error fetching products", error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadData(1, searchTerm)
        }, 400)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, loadData])

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await axios.delete(`/api/product`, { data: { id }, withCredentials: true });
            if (res.data.success) {
                toast.success("Product deleted");
                setProducts(prev => prev.filter(p => p.product_id !== id));
            }
        } catch (error) {
            toast.error("Failed to delete product");
        }
    }

    return (
        <div className="w-full flex flex-col gap-4 bg-slate-50 min-h-screen relative">
            
            {/* Header */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
                <div>
                    <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Product Management</h1>
                    <p className='text-sm text-slate-500 mt-1'>Manage your store inventory catalog and prices</p>
                </div>
                <div className='w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
                    {products.length > 0 && (
                        <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 px-3 py-2.5 rounded-xs text-center whitespace-nowrap border border-sky-100">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                    )}
                    <div className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xs border border-slate-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100/50 transition-all sm:w-72'>
                        <FaBarcode className='text-slate-400 text-lg' />
                        <input
                            type="text"
                            placeholder="Search by name or barcode..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400'
                        />
                    </div>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 sm:gap-3 px-4 sm:px-5 py-3 bg-white border border-slate-200 rounded-xs font-bold text-slate-500 text-[11px] sm:text-xs uppercase tracking-wider shadow-xs items-center">
                <div className="col-span-2 sm:col-span-1">ID</div>
                <div className="col-span-5 sm:col-span-5 lg:col-span-5">Product Name</div>
                <div className="hidden lg:block lg:col-span-2 text-center">Category</div>
                <div className="col-span-2 sm:col-span-2 lg:col-span-2 text-center">Stock</div>
                <div className="col-span-1 text-right">Price</div>
                <div className="col-span-2 sm:col-span-1 text-right">Action</div>
            </div>

            {/* Product List */}
            <div className="w-full flex flex-col gap-2.5">
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-16 bg-white animate-pulse rounded-xs border border-slate-200"></div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
                        <p className='text-slate-600 font-semibold'>No Products Found</p>
                        <p className='text-slate-400 text-sm mt-1'>Try adjusting your search query.</p>
                    </div>
                ) : (
                    products.map((item) => (
                        <div 
                            key={item.product_id} 
                            className="w-full border border-slate-200 rounded-xs shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-3 sm:p-4 lg:py-3 lg:px-5 bg-white"
                        >
                            <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                                {/* 1. ID */}
                                <div className="col-span-2 sm:col-span-1">
                                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-1.5 sm:px-2 py-1 rounded-md">
                                        #{item.product_id}
                                    </span>
                                </div>

                                {/* 2. Product Name */}
                                <div className="col-span-5 sm:col-span-5 lg:col-span-5 flex flex-col min-w-0 pr-2">
                                    <Link className='font-bold text-slate-800 hover:text-sky-600 transition-colors text-xs sm:text-sm truncate' href={`/products/${item.slug}`} title={item.name}>
                                        {item.name}
                                    </Link>
                                    {item.barcode && (
                                        <span className="text-[10px] text-slate-400 font-mono truncate">
                                            Barcode: {item.barcode}
                                        </span>
                                    )}
                                </div>

                                {/* 3. Category */}
                                <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                                        {item.category_name || 'General'}
                                    </span>
                                </div>

                                {/* 4. Stock */}
                                <div className="col-span-2 sm:col-span-2 lg:col-span-2 text-center">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${item.stock > 10 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                        {item.stock} Qty
                                    </span>
                                </div>

                                {/* 5. Price */}
                                <div className="col-span-1 text-right font-bold text-slate-900 text-xs sm:text-sm">
                                    ৳{parseFloat(item.sale_price || 0).toFixed(0)}
                                </div>

                                {/* 6. Actions */}
                                <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1">
                                    <Link href={`/dashboard/products/${item.slug}`} className='p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all' title="Edit Product">
                                        <MdEdit size={16} />
                                    </Link>
                                    <button onClick={() => handleDelete(item.product_id)} className='p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer' title="Delete Product">
                                        <MdDeleteOutline size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {!searchTerm && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2 pt-4 border-t border-slate-200">
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => loadData(pagination.currentPage - 1)}
                        className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed bg-white"
                    >
                        <ArrowLeft size={16} />
                    </button>

                    <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                        {pagination.currentPage > 4 && pagination.totalPages > 5 && (
                            <>
                                <button
                                    onClick={() => loadData(1)}
                                    className="w-8 h-8 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer bg-white"
                                >
                                    1
                                </button>
                                <span className="px-1 font-bold text-slate-300 text-xs">...</span>
                            </>
                        )}

                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter(num => {
                                const current = pagination.currentPage;
                                const total = pagination.totalPages;

                                if (total <= 5) return true;
                                if (current <= 4) return num <= 5;
                                if (current >= total - 3) return num >= total - 4;

                                return num >= current - 1 && num <= current + 1;
                            })
                            .map((num) => (
                                <button
                                    key={num}
                                    onClick={() => loadData(num)}
                                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        pagination.currentPage === num
                                            ? 'bg-sky-500 text-white shadow-xs'
                                            : 'border border-slate-200 text-slate-600 hover:bg-slate-100 bg-white'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}

                        {pagination.currentPage < pagination.totalPages - 3 && pagination.totalPages > 5 && (
                            <>
                                <span className="px-1 font-bold text-slate-300 text-xs">...</span>
                                <button
                                    onClick={() => loadData(pagination.totalPages)}
                                    className="w-8 h-8 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer bg-white"
                                >
                                    {pagination.totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => loadData(pagination.currentPage + 1)}
                        className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed bg-white"
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProductListPage

