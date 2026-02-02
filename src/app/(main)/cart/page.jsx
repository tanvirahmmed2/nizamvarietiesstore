'use client'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect, useState } from 'react'
import { MdDeleteOutline } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';

const Cart = () => {
  const { cart, removeFromCart, decreaseQuantity, clearCart } = useContext(Context)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subTotal: 0,
    discount: 0,
    totalPrice: 0,
    paymentMethod: 'cash',
    transactionId: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (!cart?.items) return;
    const subTotal = cart.items.reduce((sum, item) => sum + (parseFloat(item.base_price) * item.quantity), 0)
    const totalDiscount = cart.items.reduce((sum, item) => sum + (parseFloat(item.discount_per_item) * item.quantity), 0)
    const totalPrice = subTotal - totalDiscount

    setFormData(prev => ({ ...prev, subTotal, discount: totalDiscount, totalPrice }))
  }, [cart?.items])

  const placeOrder = async (e) => {
    e.preventDefault()
    
    const payload = {
      customerName: formData.name,
      phone: formData.phone,
      subtotal: formData.subTotal,
      discount: formData.discount,
      total: formData.totalPrice,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId,
      status: 'pending', // GUESTS must wait for salesman approval
      items: cart.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }))
    }

    try {
      const response = await axios.post('/api/order', payload, { withCredentials: true })
      toast.success(response.data.message);
      clearCart()
      setFormData({ name: '', phone: '', subTotal: 0, discount: 0, totalPrice: 0, paymentMethod: 'cash', transactionId: '' })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to place order')
    }
  }

  if (!cart || cart?.items.length < 1) return (
    <div className='w-full p-20 text-center flex flex-col items-center gap-4'>
      <p className='text-2xl text-gray-400'>Your cart is empty</p>
      <Link href="/products" className='bg-sky-500 text-white px-6 py-2 rounded-full'>Continue Shopping</Link>
    </div>
  )

  return (
    <div className='w-full max-w-5xl mx-auto p-4 flex flex-col lg:flex-row gap-8'>
      {/* Items Section */}
      <div className='flex-1'>
        <h1 className='text-3xl font-bold mb-6'>Shopping Cart</h1>
        <div className='flex flex-col gap-4'>
          {cart.items.map((item) => (
            <div key={item?.product_id} className='flex items-center justify-between border-b pb-4'>
              <div className='flex-1'>
                <p className='font-bold text-lg'>{item?.name}</p>
                <p className='text-sm text-gray-500'>৳{item?.price} per unit</p>
              </div>
              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-full'>
                  <FaMinus className='cursor-pointer text-xs' onClick={() => decreaseQuantity(item?.product_id)} />
                  <span className='font-bold'>{item?.quantity}</span>
                </div>
                <p className='font-bold w-20 text-right'>৳{(item.price * item.quantity).toFixed(2)}</p>
                <MdDeleteOutline className='text-2xl text-red-500 cursor-pointer' onClick={() => removeFromCart(item?.product_id)} />
              </div>
            </div>
          ))}
          <button onClick={clearCart} className='text-sm text-red-400 self-start mt-2 hover:underline'>Clear Cart Items</button>
        </div>
      </div>

      {/* Checkout Form Section */}
      <div className='w-full lg:w-100 bg-gray-50 p-6 rounded-2xl border border-black/5'>
        <h2 className='text-xl font-bold mb-4'>Checkout Details</h2>
        <form onSubmit={placeOrder} className='flex flex-col gap-4'>
          <input type="text" name='name' required placeholder="Your Full Name" onChange={handleChange} value={formData.name} className='p-3 border rounded-xl outline-none bg-white' />
          <input type="text" name='phone' required placeholder="Phone Number (e.g. 017...)" onChange={handleChange} value={formData.phone} className='p-3 border rounded-xl outline-none bg-white' />
          
          <select name="paymentMethod" onChange={handleChange} value={formData.paymentMethod} className='p-3 border rounded-xl outline-none bg-white'>
            <option value="cash">Cash on Delivery</option>
            <option value="online">Online Payment</option>
            <option value="card">Card Payment</option>
          </select>

          {formData.paymentMethod !== 'cash' && (
             <input type="text" name="transactionId" placeholder="Trx ID / Ref" onChange={handleChange} value={formData.transactionId} className='p-3 border rounded-xl outline-none bg-white border-sky-300' />
          )}

          <div className='flex flex-col gap-2 border-t pt-4 text-sm'>
            <div className='flex justify-between'><span>Subtotal</span><span>৳{formData.subTotal.toFixed(2)}</span></div>
            <div className='flex justify-between text-green-600 font-medium'><span>Saved Discount</span><span>-৳{formData.discount.toFixed(2)}</span></div>
            <div className='flex justify-between text-lg font-bold mt-2'><span>Net Total</span><span>৳{formData.totalPrice.toFixed(2)}</span></div>
          </div>

          <button className='w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all mt-4' type='submit'>
            Place Order (Pending Approval)
          </button>
        </form>
      </div>
    </div>
  )
}

export default Cart