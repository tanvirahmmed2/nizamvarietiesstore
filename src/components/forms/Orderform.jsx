'use client'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'
import { MdOutlineDeleteOutline } from 'react-icons/md'

const Orderform = ({ cartItems }) => {
    const { fetchCart, decreaseQuantity, clearCart } = useContext(Context)
    const [data, setData] = useState({
        name: 'Walk-in Customer',
        phone: '+88',
        manualDiscount: 0,
        tax: 0,
        subTotal: 0,
        totalDiscount: 0,
        totalPrice: 0,
        transactionId: '',
        paymentMethod: 'cash'
    })

    useEffect(() => {
        const subTotal = cartItems.reduce(
            (sum, item) => sum + (parseFloat(item.base_price) * item.quantity),
            0
        )
        const productDiscount = cartItems.reduce(
            (sum, item) => sum + (parseFloat(item.discount_per_item) * item.quantity),
            0
        )
        const manualDiscount = parseFloat(data.manualDiscount) || 0
        const tax = parseFloat(data.tax) || 0

        const totalDiscount = productDiscount + manualDiscount
        const totalPrice = subTotal - totalDiscount + tax

        setData(prev => ({
            ...prev,
            subTotal,
            totalDiscount,
            totalPrice
        }))
    }, [cartItems, data.manualDiscount, data.tax])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (cartItems.length === 0) {
            return toast.error("Please add items to cart first");
        }

        const payload = {
            customerName: data.name,
            phone: data.phone,
            subtotal: data.subTotal,
            discount: data.totalDiscount,
            total: data.totalPrice,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
            status: 'completed', // Direct sales from POS are confirmed immediately
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }))
        }

        try {
            const response = await axios.post('/api/order', payload, { withCredentials: true });
            toast.success("Order Processed Successfully!");
            if (fetchCart) fetchCart();

            setData({
                name: 'Walk-in Customer',
                phone: '+88',
                manualDiscount: 0,
                tax: 0,
                subTotal: 0,
                totalDiscount: 0,
                totalPrice: 0,
                transactionId: '',
                paymentMethod: 'cash'
            })
            clearCart()
        } catch (error) {
            toast.error(error?.response?.data?.message || "Checkout failed");
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-between gap-6 text-sm bg-white p-4 rounded-xl shadow-sm border border-black/5'>
            <div className='w-full flex flex-col gap-3'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label className='font-semibold'>Name</label>
                    <input type="text" name='name' value={data.name} onChange={handleChange} className='px-3 py-1 border border-black/10 rounded-lg outline-none w-2/3' />
                </div>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label className='font-semibold'>Phone</label>
                    <input type="text" name='phone' value={data.phone} onChange={handleChange} className='px-3 py-1 border border-black/10 rounded-lg outline-none w-2/3' />
                </div>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label className='font-semibold'>Payment</label>
                    <select name="paymentMethod" value={data.paymentMethod} onChange={handleChange} className='px-3 py-1 border border-black/10 rounded-lg outline-none w-2/3'>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="online">Online</option>
                    </select>
                </div>
                {data.paymentMethod !== 'cash' && (
                    <div className='w-full flex flex-row items-center justify-between'>
                        <label className='font-semibold text-sky-600'>Trx ID</label>
                        <input type="text" name='transactionId' value={data.transactionId} onChange={handleChange} className='px-3 py-1 border border-sky-200 rounded-lg outline-none w-2/3' />
                    </div>
                )}
            </div>

            <div className='w-full max-h-48 overflow-y-auto border-y border-black/5 py-2'>
                {cartItems.map(item => (
                    <div key={item.product_id} className='w-full flex justify-between items-center p-2 mb-1 bg-gray-50 rounded-lg'>
                        <p className='text-xs font-medium truncate w-1/2'>{item.name}</p>
                        <div className='flex items-center gap-3'>
                            <p className='text-xs'>{item.quantity} x {item.price}</p>
                            <MdOutlineDeleteOutline className='cursor-pointer text-red-500 text-lg' onClick={() => decreaseQuantity(item.product_id)} />
                        </div>
                    </div>
                ))}
            </div>

            <div className='w-full flex flex-col gap-2 pt-2'>
                <div className='flex justify-between'><span>Sub Total</span><span>{data.subTotal.toFixed(2)}</span></div>
                <div className='flex justify-between text-red-500'><span>Discount</span><span>-{data.totalDiscount.toFixed(2)}</span></div>
                <div className='flex justify-between'>
                    <label>Tax</label>
                    <input type="number" name="tax" value={data.tax} onChange={handleChange} className='w-20 border-b border-black/10 outline-none text-right' />
                </div>
                <div className='flex justify-between'>
                    <label>Manual Disc.</label>
                    <input type="number" name="manualDiscount" value={data.manualDiscount} onChange={handleChange} className='w-20 border-b border-black/10 outline-none text-right' />
                </div>
                <div className='flex justify-between font-bold text-lg border-t pt-2 mt-2 text-sky-700'>
                    <span>Total Bill</span><span>৳{data.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <button className='w-full py-3 rounded-xl bg-sky-600 text-white hover:bg-sky-500 font-bold shadow-md transition-all uppercase' type='submit'>Complete Sale</button>
        </form>
    )
}

export default Orderform