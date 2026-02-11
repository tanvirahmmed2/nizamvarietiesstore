'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../helper/Context'
import { FaPlus, FaMinus, FaTrash, FaFileInvoiceDollar } from 'react-icons/fa6'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddPurchaseForm = () => {
    const { 
        purchaseItems, 
        setPurchaseItems, // Now available thanks to the Context fix
        removeFromPurchase, 
        clearPurchase, 
        isSupplierBox, 
        setIsSupplierBox, 
        suppliers 
    } = useContext(Context)

    const [formData, setFormData] = useState({ 
        supplier_id: '', 
        invoice_no: '', 
        extra_discount: 0, 
        payment_method: 'cash', 
        transaction_id: '', 
        note: '' 
    })
    
    const [totals, setTotals] = useState({ subtotal: 0, total: 0 })

    // Recalculate Subtotal and Total whenever items or discount change
    useEffect(() => {
        const sub = purchaseItems.reduce((acc, item) => {
            const price = parseFloat(item.purchase_price) || 0
            const qty = parseFloat(item.quantity) || 0
            return acc + (price * qty)
        }, 0)

        const disc = parseFloat(formData.extra_discount) || 0
        setTotals({ 
            subtotal: sub, 
            total: Math.max(0, sub - disc) // Prevents negative total
        })
    }, [purchaseItems, formData.extra_discount])

    // Updates the global purchaseItems array when an input changes
    const handleItemUpdate = (productId, field, value) => {
        const updatedItems = purchaseItems.map((item) => {
            if (item.product_id === productId) {
                return { ...item, [field]: value }
            }
            return item
        })
        setPurchaseItems(updatedItems)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const finalSupplierId = Number(formData.supplier_id)

        if (!finalSupplierId) return toast.error("Please select a supplier")
        if (purchaseItems.length === 0) return toast.error("Please add products to the list")

        const payload = {
            ...formData,
            supplier_id: finalSupplierId,
            subtotal_amount: totals.subtotal,
            total_amount: totals.total,
            items: purchaseItems.map(item => ({
                ...item,
                purchase_price: parseFloat(item.purchase_price),
                quantity: parseFloat(item.quantity)
            }))
        }

        try {
            const response = await axios.post('/api/purchase', payload, { withCredentials: true })
            toast.success(response.data.message)
            setFormData({ supplier_id: '', invoice_no: '', extra_discount: 0, payment_method: 'cash', transaction_id: '', note: '' })
            clearPurchase()
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full mx-auto p-4 flex flex-col gap-6 bg-white min-h-screen">
           
            <div className="flex items-center gap-3 border-b pb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><FaFileInvoiceDollar size={24} /></div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Product Purchase</h1>
                    <p className="text-xs text-gray-500">Add stock and record supplier invoice</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Supplier Selection</label>
                    <div className="flex gap-2">
                        {suppliers.length > 0 ? (
                            <select name="supplier_id" required onChange={handleChange} value={formData.supplier_id} className="w-full bg-white border border-gray-200 outline-none p-2 rounded-lg text-sm">
                                <option value="">--Select Supplier--</option>
                                {suppliers.map((s) => (<option value={s.supplier_id} key={s.supplier_id}>{s.name}</option>))}
                            </select>
                        ) : <p className="text-xs text-red-500 font-bold">No Suppliers Found</p>}
                        <button type="button" onClick={() => setIsSupplierBox(true)} className="px-4 bg-sky-600 text-white rounded-lg text-[10px] font-bold whitespace-nowrap">ADD NEW</button>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Invoice Number</label>
                    <input type="text" name="invoice_no" className="w-full border border-gray-200 px-4 py-2 rounded-lg outline-none text-sm bg-white" onChange={handleChange} value={formData.invoice_no} placeholder="e.g. #PUR-2024" />
                </div>
            </div>


            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-gray-700 flex justify-between items-center px-1">
                    Items to Purchase 
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">{purchaseItems.length} Products</span>
                </h3>

                {purchaseItems.length > 0 ? (
                    purchaseItems.map((item) => (
                        <div key={item.product_id} className="grid grid-cols-12 items-center gap-3 px-4 p-1 even:bg-gray-200 bg-white border border-gray-100 rounded-2xl shadow-sm">
                         
                            <div className="col-span-12 lg:col-span-4">
                                <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-400">ID: {item.product_id}</p>
                            </div>
                            
                            
                            <div className="col-span-4 lg:col-span-2">
                                <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Unit Price</label>
                                <div className="relative">
                                    <span className="absolute left-2 top-1.5 text-xs text-gray-400">৳</span>
                                    <input 
                                        type="number" 
                                        value={item.purchase_price} 
                                        onChange={(e) => handleItemUpdate(item.product_id, 'purchase_price', e.target.value)}
                                        className="w-full border rounded-md pl-5 pr-2 py-1 text-sm outline-sky-400"
                                    />
                                </div>
                            </div>


                            <div className="col-span-4 lg:col-span-2">
                                <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Quantity</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={item.quantity} 
                                    onChange={(e) => handleItemUpdate(item.product_id, 'quantity', e.target.value)}
                                    className="w-full border rounded-md px-2 py-1 text-sm outline-sky-400 font-medium"
                                />
                            </div>


                            <div className="col-span-3 lg:col-span-3 text-right">
                                <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Subtotal</label>
                                <p className="text-sm font-black text-gray-800">
                                    ৳{((parseFloat(item.purchase_price) || 0) * (parseFloat(item.quantity) || 0)).toFixed(2)}
                                </p>
                            </div>


                            <div className="col-span-1 flex justify-end">
                                <button type="button" onClick={() => removeFromPurchase(item.product_id)} className="p-2 text-red-300 hover:text-red-600 transition-colors">
                                    <FaTrash size={14}/>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-sm text-gray-400 font-medium">Your purchase list is empty.</p>
                    </div>
                )}
            </div>

            <div className="w-full flex flex-col gap-1 p-3 bg-black rounded-3xl mt-auto shadow-2xl">
                <div className="flex justify-between text-slate-400 text-sm">
                    <span>Subtotal Amount</span>
                    <span>৳{totals.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-white">
                    <span className="text-sm">Extra Discount</span>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            name="extra_discount" 
                            value={formData.extra_discount} 
                            onChange={handleChange} 
                            className="w-24 bg-slate-800 border border-slate-700 text-right outline-none rounded-lg px-2 py-1 text-sky-400 font-bold"
                            onFocus={(e) => e.target.select()} 
                        />
                    </div>
                </div>

                <div className="h-px bg-white/10 my-2"></div>

                <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Grand Total</span>
                    <span className="text-4xl font-black text-sky-400">৳{totals.total.toFixed(2)}</span>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-sky-500 text-white p-2 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-400 transition-all mt-4 active:scale-95 shadow-lg shadow-sky-900/20"
                >
                    Complete Purchase
                </button>
            </div>
        </form>
    )
}

export default AddPurchaseForm