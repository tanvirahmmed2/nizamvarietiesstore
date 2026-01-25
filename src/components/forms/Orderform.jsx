'use client'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'
import { MdOutlineDeleteOutline } from 'react-icons/md'

const Orderform = ({ cartItems }) => {
    const { fetchCart, decreaseQuantity } = useContext(Context)
    const [data, setData] = useState({
        name: 'customer',
        phone: '+88',
        delivery: 'pickup',
        address: '',
        discount: 0,
        tax: 0,
        totalPrice: 0,
        totalWholeSalePrice: 0,
        paymentMethod: 'cash'
    })

    useEffect(() => {
        const subTotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        )

        const discount = 0

        const totalPrice = subTotal - discount
        setData(prev => ({
            ...prev,
            subTotal,
            discount,
            totalPrice,
            items: cartItems
        }))

    }, [cartItems])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleMethodChange = (method) => {
        setData(prev => ({ ...prev, delivery: method }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('/api/order', data, { withCredentials: true });
            toast.success(response.data.message);
            fetchCart()
        } catch (error) {
            console.log(error)
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
                {data.delivery === 'homedelivery' &&
                    <div className='w-full flex flex-row items-center justify-between'>
                        <label htmlFor="address">Address</label>
                        <input type="Text" id='address' name='address' value={data.address} onChange={handleChange} className='px-3 border-2 border-black/10 rounded-lg outline-none' />
                    </div>
                }
                <div className='w-full flex flex-row items-center justify-between'>
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select name="paymentMethod" id="paymentMethod" value={data.paymentMethod} onChange={handleChange} className='px-3 border-2 border-black/10 rounded-lg outline-none'>
                        <option value="cash">cash</option>
                        <option value="card">Card</option>
                        <option value="online">Online</option>
                    </select>
                </div>
            </div>


            {cartItems.length > 0 && cartItems.map(item => (
                <div key={item.productId} className='w-full grid-cols-2 grid border border-black/10 p-1 rounded-lg gap-2'>
                    <p className='text-xs'>{item.title}</p>
                    <div className='w-full flex flex-row items-center justify-between px-2'>
                        <p>{item.quantity}</p>
                        <p>{item.price}</p>
                        <p onClick={() => decreaseQuantity(item.productId)}><MdOutlineDeleteOutline /></p>
                    </div>
                </div>
            ))}


            <div className='w-full flex flex-col gap-6 items-center justify-center'>
                <div className='w-full flex flex-col gap-2 border-b-2 border-black/10 items-center justify-center'>
                    <div className='w-full flex flex-row items-center justify-between'>
                        <p>Sub Total</p>
                        <p>{data.subTotal}</p>
                    </div>
                    <div className='w-full flex flex-row items-center justify-between'>
                        <p>Discount</p>
                        <p>{data.discount}</p>
                    </div>
                    <div className='w-full flex flex-row items-center justify-between'>
                        <p>Tax</p>
                        <p>{data.tax}</p>
                    </div>
                </div>
                <div className='w-full flex flex-row items-center justify-between'>
                    <p>Total</p>
                    <p>{data.totalPrice}</p>
                </div>
            </div>

            <button className='w-auto px-8 p-1 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-500 ' type='submit'>Submit</button>
        </form>
    )
}

export default Orderform
