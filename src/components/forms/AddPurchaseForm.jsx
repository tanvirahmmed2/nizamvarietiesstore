'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../helper/Context'
import { FaMinus, FaPlus, FaFileInvoiceDollar } from 'react-icons/fa6'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddPurchaseForm = () => {
    const { purchaseItems, removeFromPurchase, decreaseFromPurchase, addToPurchase, clearPurchase, isSupplierBox, setIsSupplierBox, suppliers } = useContext(Context)

    const [formData, setFormData] = useState({ supplier_id: '', invoice_no: '', extra_discount: 0, payment_method: 'cash', transaction_id: '', note: '' })
    const [totals, setTotals] = useState({ subtotal: 0, total: 0 })

    useEffect(() => {
        const sub = purchaseItems.reduce((acc, item) => acc + (parseFloat(item.purchase_price || 0) * item.quantity), 0)
        const disc = parseFloat(formData.extra_discount) || 0
        setTotals({ subtotal: sub, total: sub - disc })
    }, [purchaseItems, formData.extra_discount])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

const handleSubmit = async (e) => {
    e.preventDefault();

    const finalSupplierId = Number(formData.supplier_id);

    console.log("PAYLOAD SUPPLIER ID:", finalSupplierId);
    console.log("PAYLOAD ITEMS:", purchaseItems);

    if (!finalSupplierId || finalSupplierId <= 0) {
        return toast.error("Please select a supplier from the list");
    }
    if (purchaseItems.length === 0) {
        return toast.error("Please add products to the purchase list");
    }

    const payload = {
        supplier_id: finalSupplierId,
        invoice_no: formData.invoice_no,
        subtotal_amount: totals.subtotal,
        extra_discount: parseFloat(formData.extra_discount) || 0,
        total_amount: totals.total,
        payment_method: formData.payment_method,
        transaction_id: formData.transaction_id,
        note: formData.note,
        items: purchaseItems
    };

    try {
        const response = await axios.post('/api/purchase', payload, {withCredentials:true});
        toast.success(response.data.message);
        setFormData({ supplier_id: '', invoice_no: '', extra_discount: 0, payment_method: 'cash', transaction_id: '', note: '' });
        clearPurchase();
    } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Internal Server Error");
    }
};

    return (
        <form onSubmit={handleSubmit} className="flex-1 mx-auto p-4 flex flex-col gap-6 bg-white min-h-screen">
            <div className="flex items-center gap-3 border-b pb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><FaFileInvoiceDollar size={24} /></div>
                <div><h1 className="text-xl font-bold text-gray-800">Product Purchase</h1><p className="text-xs text-gray-500">Record new purchase from supplier</p></div>
            </div>

            <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-full flex flex-row items-center justify-center gap-2">
                    {suppliers.length > 0 ? (
                        <select name="supplier_id" id="supplier_id" required onChange={handleChange} value={formData.supplier_id} className="w-full bg-gray-100 border outline-none p-2 rounded-lg">
                            <option value="">--Select Supplier--</option>
                            {suppliers.map((supplier) => (<option value={supplier.supplier_id} key={supplier.supplier_id}>{supplier.name}</option>))}
                        </select>
                    ) : (<p className="text-sm text-red-500 font-bold">No supplier Found, Please add</p>)}
                    <button type="button" onClick={() => setIsSupplierBox(!isSupplierBox)} className="p-2 text-center px-4 bg-sky-600 text-white rounded-full text-xs font-bold">ADD NEW</button>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Invoice Reference</label>
                    <input type="text" name="invoice_no" className="w-full border border-sky-400 px-4 py-2 rounded-lg outline-none text-sm" onChange={handleChange} value={formData.invoice_no} placeholder="e.g. #INV-9901" />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-gray-700 flex justify-between items-center px-1">Selected Products <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">{purchaseItems.length} Items</span></h3>
                {purchaseItems.length > 0 ? (
                    purchaseItems.map((item) => (
                        <div key={item.product_id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-800 truncate">{item.name}</p><p className="text-xs text-gray-500 font-medium">৳{(item.purchase_price || 0).toFixed(2)} / unit</p></div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-3">
                                    <button type="button" onClick={() => decreaseFromPurchase(item.product_id)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-red-500 shadow-sm"><FaMinus size={10} /></button>
                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <button type="button" onClick={() => addToPurchase(item)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-blue-500 shadow-sm"><FaPlus size={10} /></button>
                                </div>
                                <div className="text-right min-w-20"><p className="text-sm font-black text-gray-800">৳{(item.purchase_price * item.quantity).toFixed(2)}</p><button type="button" onClick={() => removeFromPurchase(item.product_id)} className="text-[10px] text-red-400 hover:text-red-600 underline font-medium">Remove</button></div>
                            </div>
                        </div>
                    ))
                ) : (<div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"><p className="text-sm text-gray-400">Search and click products to add them here.</p></div>)}
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-2 p-4 bg-slate-800 rounded-2xl mt-auto">
                <div className="w-full flex flex-col items-center justify-center gap-2">
                    <div className="w-full flex flex-row items-center justify-between gap-1 text-white/70 text-sm"><span>Subtotal</span><span>৳{totals.subtotal.toFixed(2)}</span></div>
                    <div className="w-full flex flex-row items-center justify-between gap-1 text-white font-bold"><span>Extra Discount</span><input type="number" name="extra_discount" value={formData.extra_discount} onChange={handleChange} className="w-24 text-right outline-none rounded-lg px-2 py-1 text-black" onFocus={(e) => e.target.select()} /></div>
                </div>
                <div className="w-full flex justify-between items-center py-2 border-t border-white/20 text-white mt-2"><span className="text-lg font-medium opacity-90">Total Payable</span><span className="text-3xl font-black text-sky-400">৳{totals.total.toFixed(2)}</span></div>
                <button type="submit" className="w-full bg-sky-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-sky-400 active:scale-95 transition-all shadow-lg mt-2">Complete Purchase</button>
            </div>
        </form>
    )
}

export default AddPurchaseForm