'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../helper/Context'
import { FaMinus, FaPlus, FaTrash, FaFileInvoiceDollar } from 'react-icons/fa6'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddPurchaseForm = () => {
    const { purchaseItems, removeFromPurchase, decreaseFromPurchase, addToPurchase, clearPurchase } = useContext(Context)

    const [formData, setFormData] = useState({
        supplier_name: 'Dealer',
        supplier_phone: '+88',
        invoice_no: '',
        extra_discount: 0,
        payment_method: 'cash',
        transaction_id: '',
        note: ''
    })

    const [totals, setTotals] = useState({ subtotal: 0, total: 0 })

    useEffect(() => {
        const sub = purchaseItems.reduce((acc, item) => {
            return acc + (parseFloat(item.purchase_price || 0) * item.quantity)
        }, 0)
        const disc = parseFloat(formData.extra_discount) || 0
        setTotals({ subtotal: sub, total: sub - disc })
    }, [purchaseItems, formData.extra_discount])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (purchaseItems.length === 0) {
            return toast.error("Please add products to the purchase list");
        }

        const payload = {
            supplier_name: formData.supplier_name,
            supplier_phone: formData.supplier_phone,
            invoice_no: formData.invoice_no,
            subtotal_amount: totals.subtotal,
            extra_discount: parseFloat(formData.extra_discount) || 0,
            total_amount: totals.total,
            payment_method: formData.payment_method,
            transaction_id: formData.transaction_id,
            note: formData.note,
            items: purchaseItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                purchase_price: item.purchase_price
            }))
        };

        try {
            const response = await axios.post('/api/purchase', payload, { withCredentials: true });

            toast.success(response.data.message || "Purchase recorded successfully");

            setFormData({
                supplier_name: '',
                supplier_phone: '+88',
                invoice_no: '',
                extra_discount: 0,
                payment_method: 'cash',
                transaction_id: '',
                note: ''
            });

            if (clearPurchase) clearPurchase();

        } catch (error) {
            console.error("Submission Error:", error);
            toast.error(error?.response?.data?.message || "Failed to add purchase");
        }
    };
    return (
        <form onSubmit={handleSubmit} className='flex-1 mx-auto p-4 flex flex-col gap-6 bg-white min-h-screen'>

            <div className='flex items-center gap-3 border-b pb-4'>
                <div className='p-3 bg-blue-50 text-blue-600 rounded-2xl'>
                    <FaFileInvoiceDollar size={24} />
                </div>
                <div>
                    <h1 className='text-xl font-bold text-gray-800'>Product Purchase</h1>
                    <p className='text-xs text-gray-500'>Record new purchase from supplier</p>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-4  bg-gray-50 rounded-2xl border border-gray-100'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-gray-500 uppercase ml-1'>Supplier</label>
                        <input type="text" name='supplier_name' required className='w-auto border border-sky-400 px-4 p-1 rounded-sm outline-none' onChange={handleChange} value={formData.supplier_name} placeholder="Supplier Name" />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-gray-500 uppercase ml-1'>Phone</label>
                        <input type="text" name='supplier_phone' className='w-auto border border-sky-400 px-4 p-1 rounded-sm outline-none' onChange={handleChange} value={formData.supplier_phone} />
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-gray-500 uppercase ml-1'>Invoice Reference</label>
                    <input type="text" name='invoice_no' className='w-auto border border-sky-400 px-4 p-1 rounded-sm outline-none' onChange={handleChange} value={formData.invoice_no} placeholder="e.g. #INV-9901" />
                </div>
            </div>

            <div className='flex flex-col gap-3'>
                <h3 className='text-sm font-bold text-gray-700 flex justify-between items-center px-1'>
                    Selected Products
                    <span className='bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]'>{purchaseItems.length} Items</span>
                </h3>

                {purchaseItems.length > 0 ? (
                    purchaseItems.map((item) => (
                        <div key={item.product_id} className='flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow'>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-bold text-gray-800 truncate'>{item.name}</p>
                                <p className='text-xs text-gray-500 font-medium'>
                                    ৳{(item.purchase_price || 0).toFixed(2)} <span className='text-[10px] text-gray-400 font-normal'>/ unit</span>
                                </p>
                            </div>

                            <div className='flex items-center gap-4'>
                                {/* Quantity Controls */}
                                <div className='flex items-center bg-gray-100 rounded-xl p-1 gap-3'>
                                    <button type='button' onClick={() => decreaseFromPurchase(item.product_id)} className='w-7 h-7 flex items-center justify-center bg-white rounded-lg text-red-500 shadow-sm'>
                                        <FaMinus size={10} />
                                    </button>
                                    <span className='text-sm font-bold w-4 text-center'>{item.quantity}</span>
                                    <button type='button' onClick={() => addToPurchase(item)} className='w-7 h-7 flex items-center justify-center bg-white rounded-lg text-blue-500 shadow-sm'>
                                        <FaPlus size={10} />
                                    </button>
                                </div>

                                <div className='text-right min-w-[70px]'>
                                    <p className='text-sm font-black text-gray-800'>৳{(item.purchase_price * item.quantity).toFixed(2)}</p>
                                    <button type='button' onClick={() => removeFromPurchase(item.product_id)} className='text-[10px] text-red-400 hover:text-red-600 underline font-medium'>Remove</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200'>
                        <p className='text-sm text-gray-400'>Search and click products to add them here.</p>
                    </div>
                )}
            </div>

            <div className='w-full flex flex-col items-center justify-center gap-2 p-2 bg-gray-400 rounded-xl'>
                <div className='w-full flex flex-col items-center justify-center gap-2'>
                    <div className='w-full flex flex-row items-center justify-between gap-1 text-white'>
                        <span>Subtotal</span>
                        <span>৳{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className='w-full flex flex-row items-center justify-between gap-1 text-white'>
                        <span>Extra Discount</span>
                        <input type="number" name="extra_discount" value={formData.extra_discount} onChange={handleChange} className='w-20 text-right outline-none rounded px-2 py-1 font-bold' onFocus={(e) => e.target.select()} />
                    </div>
                </div>

                <div className='flex justify-between items-center'>
                    <span className='text-lg font-medium opacity-90'>Total Payable</span>
                    <span className='text-3xl font-black'>৳{totals.total.toFixed(2)}</span>
                </div>

                <button type='submit' className='w-full bg-white text-blue-900 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-50 active:scale-95 transition-all shadow-lg'>
                    Complete Purchase
                </button>
            </div>
        </form>
    )
}

export default AddPurchaseForm