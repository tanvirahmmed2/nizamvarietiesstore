'use client'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useCart } from '../context/Context'
import { MdAddShoppingCart } from "react-icons/md";

const SalesAddToCart = ({ product }) => {
    const { fetchCart } = useCart()
    const [formData, setFormData] = useState({
        title: product.title,
        productId: product._id,
        quantity: 1
    })

    useEffect(() => {
        setFormData({
            title: product.title,
            productId: product._id,
            quantity: 1
        })
    }, [product])

    const addItemToCart = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/user/cart', formData, { withCredentials: true })
            toast.success(response.data.message)
            fetchCart()
            setFormData({
                title: product.title,
                productId: product._id,
                quantity: 1
            })
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add to cart')
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value) || '' : value
        }))
    }

    return (
        <div className={`w-full flex flex-row items-center ${!product.isAvailable ? 'bg-red-400' : 'bg-transparent'} px-3 p-1 border-b-2 border-black/10`}>
            <p className='flex-4'>{product?.title}</p>
            <p className='flex-1'>{product?.price - product?.discount}</p>
            {
                product?.isAvailable ? <form onSubmit={addItemToCart} className='flex-1 flex flex-row items-center gap-4'>
                    <input
                        type="number"
                        id='quantity'
                        name='quantity'
                        min={1}
                        onChange={handleChange}
                        value={formData.quantity}
                        className='w-20 border rounded-lg px-2'
                    />
                    <button type='submit' className='text-xl cursor-pointer shadow p-2 rounded-full'>
                        <MdAddShoppingCart />
                    </button>
                </form> : <p>Stock out</p>
            }
        </div>
    )
}

export default SalesAddToCart