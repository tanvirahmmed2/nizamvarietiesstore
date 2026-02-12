'use client'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'
import { MdDeleteOutline } from 'react-icons/md'
import { generateReceipt } from '@/lib/database/print'
import { FaMinus, FaPlus } from 'react-icons/fa6'

const Orderform = ({ cartItems = [] }) => {
    const { decreaseQuantity, clearCart, addToCart, removeFromCart, setCart } = useContext(Context)
    const [saleType, setSaleType] = useState('retail')

    const [data, setData] = useState({
        name: 'Walk-in Customer',
        phone: '+88',
        extradiscount: 0,
        subTotal: 0,
        totalDiscount: 0,
        totalPrice: 0,
        transactionId: '',
        paymentMethod: 'cash'
    })

    const handleSaleTypeChange = (type) => {
        setSaleType(type)
        setCart(prev => ({
            ...prev,
            items: prev.items.map(item => ({
                ...item,
                price: type === 'wholesale'
                    ? (parseFloat(item.wholesale_price) || 0)
                    : (parseFloat(item.sale_price) || 0) - (parseFloat(item.discount_price) || 0)
            }))
        }))
    }

    useEffect(() => {
        const subTotal = cartItems.reduce((sum, item) => {
            const base = saleType === 'retail'
                ? (parseFloat(item.sale_price) || 0)
                : (parseFloat(item.wholesale_price) || 0);
            return sum + (base * (item.quantity || 0));
        }, 0)

        const productDiscountTotal = cartItems.reduce((sum, item) => {
            const discountPerUnit = saleType === 'wholesale' ? 0 : (parseFloat(item.discount_price) || 0);
            return sum + (discountPerUnit * (item.quantity || 0));
        }, 0)

        const manualDiscount = parseFloat(data.extradiscount) || 0
        const totalPrice = subTotal - productDiscountTotal - manualDiscount

        setData(prev => ({
            ...prev,
            subTotal,
            totalDiscount: productDiscountTotal,
            totalPrice: Math.max(0, totalPrice)
        }))
    }, [cartItems, data.extradiscount, saleType])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (cartItems.length === 0) return toast.error("Cart is empty")

        const payload = {
            customerName: data.name,
            phone: data.phone,
            subtotal: data.subTotal,
            discount: data.totalDiscount + (parseFloat(data.extradiscount) || 0),
            total: data.totalPrice,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
            saleType: saleType,
            status: 'completed',
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }))
        }

        try {
            const response = await axios.post('/api/order', payload, { withCredentials: true })
            toast.success(response.data.message)
            if (generateReceipt) generateReceipt(response.data.payload)
            
            clearCart()
            setData({
                name: 'Walk-in Customer', 
                phone: '+88', 
                extradiscount: 0, 
                transactionId: '',
                paymentMethod: 'cash',
                subTotal: 0,
                totalDiscount: 0,
                totalPrice: 0
            })
            setSaleType('retail')
        } catch (error) {
            toast.error(error?.response?.data?.message || "Checkout failed")
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-between gap-4 text-sm bg-white p-4 rounded-xl shadow-md border border-gray-100'>

            <div className='grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg w-full'>
                <button type="button" onClick={() => handleSaleTypeChange('retail')}
                    className={`py-2 rounded-md font-bold transition-all ${saleType === 'retail' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500'}`}>Retail</button>
                <button type="button" onClick={() => handleSaleTypeChange('wholesale')}
                    className={`py-2 rounded-md font-bold transition-all ${saleType === 'wholesale' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-500'}`}>Wholesale</button>
            </div>

            <div className='w-full flex flex-col gap-3'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label className='font-semibold'>Customer</label>
                    <input type="text" name='name' value={data.name} onChange={handleChange} className='px-3 py-1 border border-black/10 rounded-lg outline-none w-2/3' />
                </div>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label className='font-semibold'>Phone</label>
                    <input type="text" name='phone' value={data.phone} onChange={handleChange} className='px-3 py-1 border border-black/10 rounded-lg outline-none w-2/3' />
                </div>
                <div className='w-full flex flex-row items-center justify-between'>
                    <label className='font-semibold'>Payment</label>
                    <select name="paymentMethod" value={data.paymentMethod} onChange={handleChange} className='px-3 py-1 border border-black/10 rounded-lg outline-none w-2/3 bg-white'>
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
                    <div key={item.product_id} className='w-full flex justify-between items-center p-2 mb-1 even:bg-gray-300 shadow border border-black/30 rounded-lg'>
                        <div className='w-1/2'>
                            <p className='text-xs font-bold truncate'>{item.name}</p>
                            <p className='text-[10px] text-sky-600 font-bold uppercase'>{saleType} Mode</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full'>
                                <FaMinus
                                    className='cursor-pointer text-gray-600 hover:text-black transition-colors'
                                    onClick={() => decreaseQuantity(item?.product_id)}
                                />
                                <span className=' text-gray-800'>{item?.quantity}</span>
                                <FaPlus
                                    className='cursor-pointer text-gray-600 hover:text-black transition-colors'
                                    onClick={() => addToCart(item)}
                                />
                            </div>
                            <p className=' w-24 text-right text-gray-800 font-medium'>
                                ৳{((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                            </p>
                            <MdDeleteOutline
                                className='text-2xl text-red-400 cursor-pointer hover:text-red-600 transition-colors'
                                onClick={() => removeFromCart(item?.product_id)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className='w-full flex flex-col gap-2 pt-2'>
                <div className='flex justify-between'>
                    <span>Sub Total ({saleType})</span>
                    <span>{data.subTotal.toFixed(2)}</span>
                </div>
                {data.totalDiscount > 0 && (
                    <div className='flex justify-between text-red-500 font-medium'>
                        <span>Auto Discount</span>
                        <span>-{data.totalDiscount.toFixed(2)}</span>
                    </div>
                )}
                <div className='flex justify-between items-center'>
                    <label>Manual Discount</label>
                    <input 
                        type="number" 
                        name="extradiscount" 
                        min={0}
                        step="0.01" 
                        value={data.extradiscount} 
                        onChange={handleChange} 
                        className='w-20 border-b border-black/10 outline-none text-right focus:border-sky-600 transition-colors' 
                    />
                </div>
                <div className='flex justify-between font-extrabold text-xl border-t border-dashed pt-2 mt-2 text-sky-700'>
                    <span>TOTAL</span>
                    <span>৳{data.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <button className='w-full py-3 rounded-xl bg-sky-600 text-white hover:bg-sky-700 font-bold shadow-lg transition-all active:scale-95 uppercase' type='submit'>
                Complete {saleType} Sale
            </button>
        </form>
    )
}

export default Orderform