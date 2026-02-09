'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'

const AddPurchaseForm = () => {
    const {purchaseItems, removeFromPurchase, decreaseFromPurchase,addToPurchase}= useContext(Context)
    const [formData, setFormdata] = useState({
        supplier_name: '',
        supplier_phone: '',
        invoice_no: '',
        total_amount: '',
        subtotal_amount: '',
        payment_method: '',
        transaction_id: '',
        note: '',
        items: purchaseItems

    })




    const handleChange = async (e) => {
        const { name, value } = e.target
        setFormdata((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <form onSubmit={handleSubmit} className='flex-1 flex flex-col items-center justify-center gap-6'>
            <h1 className='w-full text-center text-2xl font-semibold'>Add Purchase</h1>
            <div className='w-full flex flex-col items-center justify-center gap-4 md:flex-row'>
                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="supplier_name">Supplier Name</label>
                    <input type="text" name='supplier_name' id='supplier_name' className='w-full px-3 p-1 rounded-lg outline-none border border-blue-400' onChange={handleChange} value={formData.supplier_name} />
                </div>
                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="supplier_phone">Supplier Phone</label>
                    <input type="text" name='supplier_phone' id='supplier_phone' className='w-full px-3 p-1 rounded-lg outline-none border border-blue-400' onChange={handleChange} value={formData.supplier_phone}/>
                </div>
            </div>
            <div>
                <div>
                    {
                        formData.items.length>0? <div>

                        </div>: <div>
                        <p>No item added</p>
                        </div>
                    }
                </div>
                <div>
                    <p>{formData.subtotal_amount}</p>
                    <p>{formData.total_amount}</p>
                </div>
            </div>
            <button type='submit'>Purchase</button>
        </form>
    )
}

export default AddPurchaseForm
