'use client'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'
import { MdOutlineDeleteOutline } from 'react-icons/md'

const Orderform = ({ cartItems }) => {
    const { fetchCart, decreaseQuantity } = useContext(Context)
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
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }))
        }

        try {
            const response = await axios.post('/api/order', payload, { withCredentials: true });
            toast.success(response.data.message);
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
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-between gap-6 text-sm'>
            <div className='w-full flex flex-col items-center justify-center gap-2'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label htmlFor="name">Name</label>
                    <input type="text" id='name' name='name' value={data.name} onChange={handleChange} className='px-3 uppercase border-2 border-black/10 rounded-lg outline-none' />
                </div>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label htmlFor="phone">Phone</label>
                    <input type="text" id='phone' name='phone' value={data.phone} onChange={handleChange} className='px-3 border-2 border-black/10 rounded-lg outline-none' />
                </div>

                <div className='w-full flex flex-row items-center justify-between'>
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select name="paymentMethod" id="paymentMethod" value={data.paymentMethod} onChange={handleChange} className='px-3 border-2 border-black/10 rounded-lg outline-none'>
                        <option value="cash">cash</option>
                        <option value="card">Card</option>
                        <option value="online">Online</option>
                    </select>
                </div>

                {data.paymentMethod !== 'cash' && (
                    <div className='w-full flex flex-row items-center justify-between'>
                        <label htmlFor="transactionId">Transaction ID</label>
                        <input type="text" id='transactionId' name='transactionId' value={data.transactionId} onChange={handleChange} className='px-3 border-2 border-black/10 rounded-lg outline-none' />
                    </div>
                )}
            </div>

            <div className='w-full max-h-40 overflow-y-auto'>
                {cartItems.length > 0 && cartItems.map(item => (
                    <div key={item.product_id} className='w-full grid-cols-2 grid border border-black/10 p-1 mb-1 rounded-lg gap-2'>
                        <p className='text-xs'>{item.name}</p>
                        <div className='w-full flex flex-row items-center justify-between px-2'>
                            <p>{item.quantity} x {item.price}</p>
                            <p className='cursor-pointer text-red-500' onClick={() => decreaseQuantity(item.product_id)}><MdOutlineDeleteOutline /></p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='w-full flex flex-col gap-4 items-center justify-center border-t border-black/10 pt-4'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <p>Sub Total</p>
                    <p>{data.subTotal.toFixed(2)}</p>
                </div>
                <div className='w-full flex flex-row items-center justify-between text-red-500'>
                    <p>Product Discount</p>
                    <p>-{(data.totalDiscount - (parseFloat(data.manualDiscount) || 0)).toFixed(2)}</p>
                </div>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label>Extra Discount</label>
                    <input type="number" name="manualDiscount" value={data.manualDiscount} onChange={handleChange} className='w-20 border-b-2 border-black/10 outline-none text-right' />
                </div>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label>Tax</label>
                    <input type="number" name="tax" value={data.tax} onChange={handleChange} className='w-20 border-b-2 border-black/10 outline-none text-right' />
                </div>
                <div className='w-full flex flex-row items-center justify-between font-bold text-lg border-t border-black/10 pt-2'>
                    <p>Total Bill</p>
                    <p>{data.totalPrice.toFixed(2)}</p>
                </div>
            </div>

            <button className='w-full py-2 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-500 font-semibold' type='submit'>Place Order</button>
        </form>
    )
}

export default Orderform