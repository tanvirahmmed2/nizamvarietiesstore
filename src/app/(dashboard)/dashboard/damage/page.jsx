'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const DamagePage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [products, setProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    const reasonPresets = [
        'Expired',
        'Physical Damage',
        'Supplier Defect',
        'Lost / Stolen',
        'Packaging Damaged'
    ]

    useEffect(() => {
        if (searchTerm.trim().length > 1) {
            setIsSearching(true)
            const delay = setTimeout(async () => {
                try {
                    const res = await axios.get(`/api/product/search?q=${encodeURIComponent(searchTerm)}`)
                    setProducts(res.data.payload || [])
                } catch (err) {
                    setProducts([])
                } finally {
                    setIsSearching(false)
                }
            }, 300)
            return () => clearTimeout(delay)
        } else { 
            setProducts([]) 
            setIsSearching(false)
        }
    }, [searchTerm])

    const handleSelectProduct = (product) => {
        setSelectedProduct(product)
        setQuantity(1)
        setReason('')
    }

    const handleQuantityChange = (val) => {
        const num = parseInt(val) || 0
        if (num < 1) {
            setQuantity(1)
        } else if (selectedProduct && num > selectedProduct.stock) {
            setQuantity(selectedProduct.stock)
            toast.error(`Quantity cannot exceed available stock (${selectedProduct.stock})`)
        } else {
            setQuantity(num)
        }
    }

    const handleDamage = async () => {
        if (!selectedProduct) return toast.error("Please select a product first")
        if (quantity < 1) return toast.error("Quantity must be at least 1")
        if (quantity > selectedProduct.stock) return toast.error("Quantity exceeds available stock")

        setLoading(true)
        try {
            const res = await axios.post('/api/product/damage', {
                product_id: selectedProduct.product_id,
                quantity: parseInt(quantity),
                reason: reason
            })
            if (res.data.success) {
                toast.success(res.data.message || "Stock reduced successfully")
                setSelectedProduct(null)
                setSearchTerm('')
                setQuantity(1)
                setReason('')
            } else {
                toast.error(res.data.message || "Failed to update stock")
            }
        } catch (err) { 
            toast.error(err.response?.data?.message || "Stock reduction failed") 
        } finally { 
            setLoading(false) 
        }
    }

    const financialImpact = selectedProduct 
        ? ((selectedProduct.purchase_price || selectedProduct.price || 0) * (parseInt(quantity) || 0)) 
        : 0

    return (
        <div className='w-full flex flex-col gap-6'>
       
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
                <div>
                    <h1 className='text-2xl font-semibold text-slate-800 tracking-tight'>Damage & Stock Loss</h1>
                    <p className='text-sm text-slate-500 mt-1'>Record inventory write-offs and stock loss entries</p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
                
                {/* Search & Product Selection */}
                <div className='lg:col-span-5 flex flex-col gap-4'>
                    <div className='bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4'>
                        <div className='flex justify-between items-center'>
                            <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                                Find Product
                            </label>
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className='text-xs text-primary hover:underline font-semibold cursor-pointer'
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <input 
                            type="text"
                            placeholder="Search by product name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100/50 transition-all'
                        />

                        <div className='flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar'>
                            {isSearching ? (
                                <div className='py-8 text-center text-slate-400 text-sm font-semibold'>
                                    Searching...
                                </div>
                            ) : searchTerm.trim().length > 1 && products.length === 0 ? (
                                <div className='py-8 text-center bg-slate-50 rounded-xl border border-slate-100 p-4'>
                                    <p className='text-slate-600 font-semibold text-sm'>No products found</p>
                                </div>
                            ) : searchTerm.trim().length <= 1 ? (
                                <div className='py-8 text-center bg-slate-50 rounded-xl border border-slate-100 p-6'>
                                    <p className='text-slate-600 font-semibold text-sm'>Search to Select Product</p>
                                    <p className='text-slate-400 text-xs mt-1'>Type at least 2 letters to search</p>
                                </div>
                            ) : (
                                products.map(p => {
                                    const isSelected = selectedProduct?.product_id === p.product_id
                                    return (
                                        <button 
                                            key={p.product_id}
                                            onClick={() => handleSelectProduct(p)}
                                            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                                isSelected 
                                                    ? 'border-primary  text-slate-900 shadow-xs' 
                                                    : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className='flex flex-col gap-0.5 min-w-0 pr-2'>
                                                <span className='font-semibold text-sm text-slate-800 truncate'>
                                                    {p.name}
                                                </span>
                                                <span className='text-xs text-slate-400 font-mono'>
                                                    ID: #{p.product_id}
                                                </span>
                                            </div>
                                            <div className='flex flex-col items-end shrink-0 gap-1'>
                                                <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                                                    p.stock <= 5 ? ' text-primary' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    Stock: {p.stock}
                                                </span>
                                                <span className='text-xs font-semibold text-slate-500'>
                                                    ৳{p.purchase_price || p.price || 0}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className='lg:col-span-7'>
                    {selectedProduct ? (
                        <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6'>
                            
                            <div className='flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80'>
                                <div>
                                   
                                    <h2 className='text-lg font-semibold text-slate-800 mt-1'>{selectedProduct.name}</h2>
                                    <p className='text-xs text-slate-500 mt-0.5'>
                                        ID: #{selectedProduct.product_id} | Available Stock: {selectedProduct.stock} units
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedProduct(null)}
                                    className='text-xs text-slate-400 hover:text-slate-600 font-semibold px-2 py-1 rounded hover:bg-slate-200/50 transition-colors cursor-pointer'
                                >
                                    Remove
                                </button>
                            </div>

                            {/* Inputs */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                                        Quantity
                                    </label>
                                    <div className='flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1'>
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(parseInt(quantity) - 1)}
                                            disabled={quantity <= 1}
                                            className='w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer shrink-0'
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="number"
                                            min="1"
                                            max={selectedProduct.stock}
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(e.target.value)}
                                            className='w-full text-center bg-transparent border-none outline-none text-base font-semibold text-slate-800'
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(parseInt(quantity) + 1)}
                                            disabled={quantity >= selectedProduct.stock}
                                            className='w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer shrink-0'
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className='text-[11px] text-slate-400 px-1'>
                                        Max: {selectedProduct.stock} units
                                    </span>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                                        Estimated Loss Value
                                    </label>
                                    <div className='flex flex-col justify-center px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 h-[46px]'>
                                        <p className='text-xl font-semibold text-slate-800'>
                                            ৳{financialImpact.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <span className='text-[11px] text-slate-400 px-1'>
                                        Cost price: ৳{selectedProduct.purchase_price || selectedProduct.price || 0} / unit
                                    </span>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className='flex flex-col gap-2'>
                                <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                                    Reason
                                </label>
                                <div className='flex flex-wrap gap-1.5 mb-1'>
                                    {reasonPresets.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setReason(preset)}
                                            className={`text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                                                reason === preset 
                                                    ? 'bg-slate-800 text-white border-slate-800 font-semibold' 
                                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                                            }`}
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Enter details..."
                                    rows={3}
                                    className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100/50 transition-all resize-none'
                                />
                            </div>

                            {/* Actions */}
                            <div className='flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100'>
                                <button 
                                    onClick={handleDamage}
                                    disabled={loading}
                                    className='flex-1 py-3.5 bg-primary/80 hover:bg-primary disabled:bg-primary/60 text-white font-semibold text-sm rounded-xl transition-all active:scale-95 cursor-pointer'
                                >
                                    {loading ? 'Updating...' : 'Confirm Stock Withdrawal'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedProduct(null)}
                                    disabled={loading}
                                    className='py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer'
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center gap-2 min-h-[380px]'>
                            <h3 className='text-base font-semibold text-slate-800'>No Product Selected</h3>
                            <p className='text-slate-400 text-sm max-w-sm'>
                                Search and select a product from the left panel to record a damage entry.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DamagePage


