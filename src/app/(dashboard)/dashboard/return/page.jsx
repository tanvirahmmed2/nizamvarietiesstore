'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const ReturnPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [products, setProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (searchTerm.length > 1) {
            const delay = setTimeout(async () => {
                try {
                    const res = await axios.get(`/api/product/search?q=${searchTerm}`)
                    setProducts(res.data.payload)
                } catch (err) { setProducts([]) }
            }, 300)
            return () => clearTimeout(delay)
        } else { setProducts([]) }
    }, [searchTerm])

    const handleReturn = async () => {
        if (!selectedProduct || quantity < 1) return toast.warning("Invalid Entry")
        setLoading(true)
        try {
            const res = await axios.post('/api/product/return', {
                product_id: selectedProduct.product_id,
                quantity: quantity,
                sale_price: selectedProduct.sale_price,
            })
            if (res.data.success) {
                toast.success("Return Processed: Revenue Adjusted")
                setSelectedProduct(null)
                setSearchTerm('')
                setQuantity(1)
            }
        } catch (err) { toast.error("Return failed") }
        finally { setLoading(false) }
    }

    return (
        <div className='max-w-6xl mx-auto w-full p-10 bg-white min-h-screen'>
            {/* Header Area */}
            <div className='flex flex-col gap-1 mb-12 border-l-4 border-emerald-500 pl-6'>
                <h1 className='text-3xl  text-gray-900 tracking-tight uppercase'>
                    Inventory Restitution
                </h1>
                <p className='text-gray-400 text-xs font-bold tracking-[0.2em] uppercase'>
                    Sales Return & Revenue Correction
                </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                
                <div className='lg:col-span-5 flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-[10px]  text-gray-400 uppercase tracking-widest ml-1'>
                            Find Product
                        </label>
                        <input 
                            type="text"
                            placeholder="Enter product name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-0 py-3 border-b-2 border-gray-100 bg-transparent focus:border-emerald-500 outline-none transition-all text-lg text-gray-800 placeholder:text-gray-200'
                        />
                    </div>
                    
                    <div className='flex flex-col gap-3 mt-4 max-h-100 overflow-y-auto custom-scrollbar'>
                        {products.length > 0 ? products.map(p => (
                            <button 
                                key={p.product_id}
                                onClick={() => setSelectedProduct(p)}
                                className={`group flex justify-between items-center p-5 rounded-xl border transition-all text-left ${selectedProduct?.product_id === p.product_id ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-50 hover:border-gray-200 bg-white shadow-sm'}`}
                            >
                                <div className='flex flex-col'>
                                    <p className='font-bold text-gray-800 group-hover:text-emerald-700'>{p.name}</p>
                                    <p className='text-xs text-gray-400 font-mono'>REF: {p.product_id}</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-sm  text-gray-900'>৳{p.sale_price}</p>
                                    <p className='text-[10px] text-gray-400 uppercase'>Per Unit</p>
                                </div>
                            </button>
                        )) : searchTerm.length > 1 && (
                            <p className='text-center py-10 text-gray-300 text-xs italic'>No matching records found</p>
                        )}
                    </div>
                </div>

                <div className='lg:col-span-7'>
                    {selectedProduct ? (
                        <div className='bg-gray-50/50 p-10 rounded border border-gray-100 flex flex-col gap-8 sticky top-10'>
                            <div className='flex justify-between items-start border-b border-gray-200 pb-6'>
                                <div>
                                    <span className='text-[10px]  text-emerald-600 uppercase tracking-[0.2em]'>Adjustment Target</span>
                                    <h2 className='text-2xl  text-gray-900 mt-1'>{selectedProduct.name}</h2>
                                </div>
                                <div className='bg-white px-4 py-2 rounded-lg border border-gray-200 text-center'>
                                    <span className='block text-[10px] text-gray-400 font-bold uppercase'>In Stock</span>
                                    <span className='text-sm  text-gray-800'>{selectedProduct.stock}</span>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Return Quantity</label>
                                    <input 
                                        type="number"
                                        value={quantity}
                                        min="1"
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className='w-full px-5 py-4 rounded-xl border-2 border-gray-100 outline-none focus:border-emerald-500 bg-white text-xl  text-gray-900 transition-all'
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Adjustment Type</label>
                                    <div className='px-5 py-4 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-between'>
                                        <span className='text-sm font-bold text-red-500'>Negative Sale</span>
                                        <div className='w-2 h-2 rounded-full bg-red-500 animate-pulse'></div>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-4 p-6 bg-white rounded-2xl border border-gray-100 flex items-center justify-between'>
                                <div>
                                    <p className='text-xs font-bold text-gray-400 uppercase'>Revenue Deduction</p>
                                    <p className='text-2xl  text-red-600'>- ৳{(selectedProduct.sale_price * quantity).toLocaleString()}</p>
                                </div>
                                <div className='h-10 w-px bg-gray-100'></div>
                                <div className='text-right'>
                                    <p className='text-xs font-bold text-gray-400 uppercase'>Inventory Gain</p>
                                    <p className='text-2xl  text-emerald-600'>+ {quantity}</p>
                                </div>
                            </div>

                            <button 
                                onClick={handleReturn}
                                disabled={loading}
                                className='w-full py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all uppercase tracking-widest shadow-2xl active:scale-[0.98] disabled:opacity-50'
                            >
                                {loading ? 'Authorizing Transaction...' : 'Confirm System Adjustment'}
                            </button>
                        </div>
                    ) : (
                        <div className='h-full min-h-100 border-2 border-dashed border-gray-100 rounded flex flex-col items-center justify-center text-center p-10'>
                            <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
                                <svg className='w-8 h-8 text-gray-200' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <p className='text-gray-400 font-medium max-w-50 leading-relaxed'>
                                Select a product from the registry to begin return process.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReturnPage