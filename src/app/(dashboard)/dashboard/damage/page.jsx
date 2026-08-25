'use client'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Context } from '@/components/helper/Context'

const DamagePage = () => {
    const { categories } = useContext(Context)
    
    // Product Catalog & Filter states (Right Panel)
    const [categoryId, setCategoryId] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 })
    const [loadingProducts, setLoadingProducts] = useState(true)

    // Withdrawal Cart states (Left Panel)
    const [selectedItems, setSelectedItems] = useState([]) // [{ product, quantity, reason }]
    const [submitting, setSubmitting] = useState(false)
    const [globalReason, setGlobalReason] = useState('')

    const reasonPresets = [
        'Expired',
        'Physical Damage',
        'Supplier Defect',
        'Lost / Stolen',
        'Packaging Damaged'
    ]

    // Fetch Products with category & pagination or search query (like POS)
    const fetchProducts = useCallback(async (page, catId, query) => {
        setLoadingProducts(true)
        try {
            let url = `/api/product?page=${page}&limit=9`
            if (query && query.trim().length > 0) {
                url = `/api/product/search?q=${encodeURIComponent(query.trim())}`
            } else if (catId) {
                url = `/api/product/category/${catId}?page=${page}&limit=9`
            }

            const res = await axios.get(url)
            if (res.data.success) {
                setProducts(res.data.payload || [])
                setPagination(res.data.pagination || { currentPage: page, totalPages: 1, totalItems: (res.data.payload || []).length })
            } else {
                setProducts([])
                setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 })
            }
        } catch (error) {
            console.error("Error fetching products for damage entry:", error)
            setProducts([])
            setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 })
        } finally {
            setLoadingProducts(false)
        }
    }, [])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts(currentPage, categoryId, searchTerm)
        }, 300)
        return () => clearTimeout(delayDebounce)
    }, [currentPage, categoryId, searchTerm, fetchProducts])

    const handleCategoryChange = (e) => {
        setCategoryId(e.target.value)
        setSearchTerm('')
        setCurrentPage(1)
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage)
        }
    }

    // Cart Management Functions
    const handleAddProduct = (product) => {
        if (!product || Number(product.stock) <= 0) {
            return toast.error("Product has no available stock")
        }

        const existingIndex = selectedItems.findIndex(i => i.product.product_id === product.product_id)
        if (existingIndex > -1) {
            const existing = selectedItems[existingIndex]
            if (existing.quantity < Number(product.stock)) {
                const updated = [...selectedItems]
                updated[existingIndex].quantity += 1
                setSelectedItems(updated)
                toast.success(`Increased ${product.name} quantity to ${updated[existingIndex].quantity}`)
            } else {
                toast.error(`Cannot exceed available stock (${product.stock})`)
            }
        } else {
            setSelectedItems(prev => [
                ...prev,
                {
                    product: product,
                    quantity: 1,
                    reason: globalReason || 'Physical Damage'
                }
            ])
            toast.success(`Added ${product.name} to withdrawal list`)
        }
    }

    const handleUpdateQuantity = (productId, newQty) => {
        const qty = parseInt(newQty) || 0
        setSelectedItems(prev => prev.map(item => {
            if (item.product.product_id === productId) {
                const maxStock = Number(item.product.stock)
                let validQty = qty
                if (qty < 1) validQty = 1
                if (qty > maxStock) {
                    validQty = maxStock
                    toast.error(`Quantity cannot exceed stock (${maxStock})`)
                }
                return { ...item, quantity: validQty }
            }
            return item
        }))
    }

    const handleUpdateReason = (productId, newReason) => {
        setSelectedItems(prev => prev.map(item => {
            if (item.product.product_id === productId) {
                return { ...item, reason: newReason }
            }
            return item
        }))
    }

    const handleRemoveItem = (productId) => {
        setSelectedItems(prev => prev.filter(item => item.product.product_id !== productId))
    }

    const handleApplyGlobalReason = (preset) => {
        setGlobalReason(preset)
        if (selectedItems.length > 0) {
            setSelectedItems(prev => prev.map(item => ({ ...item, reason: preset })))
        }
    }

    const handleDamageSubmit = async (e) => {
        if (e) e.preventDefault()
        if (selectedItems.length === 0) return toast.error("Withdrawal list is empty")

        for (const item of selectedItems) {
            if (item.quantity < 1 || item.quantity > Number(item.product.stock)) {
                return toast.error(`Invalid quantity for ${item.product.name}`)
            }
        }

        setSubmitting(true)
        try {
            const payload = {
                items: selectedItems.map(item => ({
                    product_id: item.product.product_id,
                    quantity: item.quantity,
                    reason: item.reason || 'Damaged'
                }))
            }

            const res = await axios.post('/api/product/damage', payload)
            if (res.data.success) {
                toast.success(res.data.message || "Stock withdrawn successfully")
                setSelectedItems([])
                setGlobalReason('')
                fetchProducts(currentPage, categoryId, searchTerm)
            } else {
                toast.error(res.data.message || "Failed to withdraw stock")
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Stock withdrawal failed")
        } finally {
            setSubmitting(false)
        }
    }

    const totalLossValue = selectedItems.reduce((sum, item) => {
        const price = parseFloat(item.product.purchase_price || item.product.sale_price || item.product.price) || 0
        return sum + (price * item.quantity)
    }, 0)

    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="w-full flex flex-col md:flex-row gap-6 relative">
            
            <div className="w-full">
                <div className='w-full flex flex-col gap-6 bg-white p-4 sm:p-6 rounded-xs border border-slate-100 shadow-sm'>
            
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-lg font-bold text-slate-800 tracking-tight'>Damage Withdrawal List</h1>
                            <p className='text-xs text-slate-400 mt-0.5'>Select items from the catalog on the right</p>
                        </div>
                        {selectedItems.length > 0 && (
                            <button 
                                type="button"
                                onClick={() => setSelectedItems([])} 
                                className='text-[10px] font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-500 hover:text-white transition-all uppercase tracking-wider cursor-pointer'
                            >
                                Clear List
                            </button>
                        )}
                    </div>

                    {/* Quick Reason Selector */}
                    <div className='flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100'>
                        <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                            Quick Reason Preset
                        </label>
                        <div className='flex flex-wrap gap-1.5'>
                            {reasonPresets.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => handleApplyGlobalReason(preset)}
                                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                        globalReason === preset 
                                            ? 'bg-primary text-white border-primary font-bold shadow-sm' 
                                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Withdrawal Items Table */}
                    <div className='w-full flex flex-col gap-1 max-h-100 overflow-y-auto border-y border-slate-100 py-3 custom-scrollbar'>
                        <div className='w-full grid grid-cols-7 sm:grid-cols-12 gap-2 px-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1'>
                            <p className='col-span-3 sm:col-span-4'>Product</p>
                            <p className='col-span-2 sm:col-span-3 text-center'>Qty</p>
                            <p className='hidden sm:block col-span-2 text-center'>Cost</p>
                            <p className='col-span-1 sm:col-span-2 text-right'>Loss</p>
                            <p className='col-span-1 text-right'>Action</p>
                        </div>

                        {selectedItems.length === 0 ? (
                            <div className='py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-1'>
                                <span className='font-bold text-slate-600'>Withdrawal list is empty</span>
                                <span>Click products from the right panel to add</span>
                            </div>
                        ) : selectedItems.map((item, idx) => {
                            const costPrice = parseFloat(item.product.purchase_price || item.product.sale_price || item.product.price) || 0
                            const rowTotal = costPrice * item.quantity

                            return (
                                <div key={item.product.product_id} className='w-full flex flex-col gap-1.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100'>
                                    <div className='grid grid-cols-7 sm:grid-cols-12 gap-2 items-center'>
                                        <div className='col-span-3 sm:col-span-4 flex flex-col pr-1'>
                                            <p className='text-xs font-bold text-slate-800 truncate' title={item.product.name}>
                                                {idx + 1}. {item.product.name}
                                            </p>
                                            <span className='text-[9px] text-slate-400 font-mono'>ID: #{item.product.product_id} · Stock: {item.product.stock}</span>
                                        </div>

                                        <div className='col-span-2 sm:col-span-3 flex items-center justify-between bg-white border border-slate-200 px-1 py-0.5 rounded-lg'>
                                            <button 
                                                type='button' 
                                                onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className='w-6 h-6 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer'
                                            >
                                                -
                                            </button>
                                            <span className='text-xs font-bold text-slate-800'>{item.quantity}</span>
                                            <button 
                                                type='button' 
                                                onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity + 1)}
                                                disabled={item.quantity >= Number(item.product.stock)}
                                                className='w-6 h-6 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer'
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className='hidden sm:block col-span-2 text-center text-xs font-bold text-slate-600'>
                                            ৳{costPrice.toFixed(0)}
                                        </div>

                                        <p className='col-span-1 sm:col-span-2 text-right font-black text-primary text-xs'>
                                            ৳{rowTotal.toFixed(0)}
                                        </p>

                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveItem(item.product.product_id)} 
                                            className='col-span-1 text-xs text-rose-500 hover:text-rose-700 font-bold text-right cursor-pointer'
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    {/* Reason field per row */}
                                    <input 
                                        type="text"
                                        value={item.reason}
                                        onChange={(e) => handleUpdateReason(item.product.product_id, e.target.value)}
                                        placeholder="Reason for withdrawal (e.g. Expired, Physical Damage)..."
                                        className='w-full px-2 py-1 text-[11px] bg-white border border-slate-200 rounded text-slate-700 placeholder:text-slate-400 outline-none focus:border-primary transition-all'
                                    />
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary Totals & Action Button */}
                    <div className='w-full flex flex-col gap-3 py-2'>
                        <div className='flex justify-between text-xs font-bold text-slate-500'>
                            <span>Selected Items</span>
                            <span className='text-slate-900'>{selectedItems.length} Products ({totalQuantity} Units)</span>
                        </div>
                        <div className='flex items-center justify-between pt-2 border-t border-dashed border-slate-200'>
                            <label className='text-sm font-bold text-slate-800 uppercase tracking-tight'>Total Loss Impact</label>
                            <span className='text-2xl font-black text-primary tracking-tighter'>৳{totalLossValue.toFixed(0)}</span>
                        </div>
                    </div>

                    <button 
                        type='button'
                        onClick={handleDamageSubmit}
                        disabled={submitting || selectedItems.length === 0}
                        className='w-full py-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98] uppercase tracking-widest text-xs mt-2 cursor-pointer'
                    >
                        {submitting ? 'Processing Withdrawal...' : `Confirm Stock Withdrawal (${selectedItems.length})`}
                    </button>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6">
                
                <div className="bg-white p-4 rounded-xs border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <select
                        value={categoryId}
                        onChange={handleCategoryChange}
                        className='w-full sm:w-1/2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xs outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold text-slate-700'
                    >
                        <option value="">All Categories</option>
                        {categories.length > 0 && categories.map((cat) => (
                            <option value={cat.category_id} key={cat.category_id}>
                                {cat?.name}
                            </option>
                        ))}
                    </select>

                    <div className='w-full sm:w-1/2 flex items-center bg-slate-50 border border-slate-200 px-3 py-2 rounded-xs focus-within:border-primary focus-within:bg-white transition-all'>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className='w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400'
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className='text-xs text-slate-400 hover:text-slate-600 font-bold ml-1'
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-h-125 flex flex-col justify-between">
                    {loadingProducts ? (
                        <div className='w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-44 bg-slate-100/70 animate-pulse rounded-xs border border-slate-100"></div>
                            ))}
                        </div>
                    ) : products.length < 1 ? (
                        <div className="w-full h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                            <p className="font-bold uppercase tracking-widest text-xs">No products found</p>
                            <p className="text-xs text-slate-400 mt-1">Try selecting another category or clear search</p>
                        </div>
                    ) : (
                        <div className='w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                            {products.map(product => {
                                const isAdded = selectedItems.some(i => i.product.product_id === product.product_id)
                                const unitPrice = parseFloat(product.purchase_price || product.sale_price || product.price) || 0

                                return (
                                    <div
                                        key={product.product_id}
                                        onClick={() => handleAddProduct(product)}
                                        className={`group relative bg-white p-2 cursor-pointer border rounded-xs transition-all duration-300 flex flex-col justify-between gap-2 ${
                                            isAdded 
                                                ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md' 
                                                : 'border-slate-100 hover:border-primary/40 hover:shadow-md'
                                        }`}
                                    >
                                        <div className='relative w-full aspect-square overflow-hidden rounded-lg bg-slate-50'>
                                            {product.image ? (
                                                <Image
                                                    src={`${product.image}`}
                                                    alt={product.name}
                                                    width={300}
                                                    height={300}
                                                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                                                />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold'>
                                                    No Image
                                                </div>
                                            )}

                                            <div className='absolute top-2 left-2 z-10 px-2 py-0.5 bg-slate-900/80 text-white text-[9px] font-bold rounded-full'>
                                                Stock: {product.stock}
                                            </div>

                                            {isAdded && (
                                                <div className='absolute top-2 right-2 z-10 px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded-full'>
                                                    Added
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex flex-col gap-0.5 px-0.5'>
                                            <h3 className='text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors' title={product.name}>
                                                {product.name}
                                            </h3>

                                            <div className='flex items-center justify-between mt-1'>
                                                <span className='text-xs font-mono text-slate-400'>
                                                    #{product.product_id}
                                                </span>
                                                <span className='text-sm font-black text-slate-900'>
                                                    ৳{unitPrice}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Pagination Bar (Matching /dashboard/pos) */}
                    {!loadingProducts && pagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2 pt-4 border-t border-slate-100">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                                title="Previous Page"
                            >
                                <ArrowLeft size={16} />
                            </button>

                            <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                                {currentPage > 3 && pagination.totalPages > 5 && (
                                    <>
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            className="w-8 h-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                                        >
                                            1
                                        </button>
                                        <span className="px-1 font-bold text-slate-300 text-xs">...</span>
                                    </>
                                )}

                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                    .filter(num => {
                                        const total = pagination.totalPages;
                                        if (total <= 5) return true;
                                        if (currentPage <= 3) return num <= 5;
                                        if (currentPage >= total - 2) return num >= total - 4;
                                        return num >= currentPage - 1 && num <= currentPage + 1;
                                    })
                                    .map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handlePageChange(num)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                currentPage === num
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}

                                {currentPage < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                                    <>
                                        <span className="px-1 font-bold text-slate-300 text-xs">...</span>
                                        <button
                                            onClick={() => handlePageChange(pagination.totalPages)}
                                            className="w-8 h-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                                        >
                                            {pagination.totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                disabled={currentPage === pagination.totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                                title="Next Page"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DamagePage
