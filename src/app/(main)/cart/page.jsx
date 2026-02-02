'use client'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect, useState } from 'react'
import { MdDeleteOutline } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";
import { toast } from 'react-toastify';
import axios from 'axios';

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
    // Calculate values based on the keys stored in Context
    const subTotal = cart.items.reduce(
      (sum, item) => sum + (parseFloat(item.base_price) * item.quantity),
      0
    )

    const totalDiscount = cart.items.reduce(
      (sum, item) => sum + (parseFloat(item.discount_per_item) * item.quantity),
      0
    )

    const totalPrice = subTotal - totalDiscount

    setFormData(prev => ({
      ...prev,
      subTotal,
      discount: totalDiscount,
      totalPrice
    }))
  }, [cart.items])

  const placeOrder = async (e) => {
    e.preventDefault()
    
    // Construct payload to match backend POST request
    const payload = {
      customerName: formData.name,
      phone: formData.phone,
      subtotal: formData.subTotal,
      discount: formData.discount,
      total: formData.totalPrice,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId,
      items: cart.items.map(item => ({
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price // This is the discounted price per unit
      }))
    }

    try {
      const response = await axios.post('/api/order', payload, { withCredentials: true })
      toast.success(response.data.message)
      clearCart()
      setFormData(prev => ({ ...prev, name: '', phone: '', transactionId: '' }))
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Failed to place order')
    }
  }

  if (!cart || cart?.items.length < 1) return (
    <div className='w-full p-10 text-center'>
      <p className='text-xl'>No cart data found</p>
    </div>
  )

  return (
    <div className='w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 p-4'>
      <h1 className='text-4xl font-semibold'>Cart</h1>

      <button onClick={clearCart} className='text-red-500 font-semibold uppercase cursor-pointer hover:underline'>
        Clear Cart
      </button>

      <div className='w-full flex flex-col gap-4'>
        {/* Table Header */}
        <div className='w-full grid grid-cols-4 font-bold border-b pb-2 text-center'>
          <p className='text-left'>Product</p>
          <p>Price</p>
          <p>Qty</p>
          <p>Actions</p>
        </div>

        {cart.items.map((item) => (
          <div key={item?.product_id} className='w-full grid grid-cols-4 items-center border-b py-4 text-center'>
            <div className='text-left'>
              <p className='font-medium'>{item?.name}</p>
              {item.discount_per_item > 0 && (
                <p className='text-xs text-green-600'>Save: ৳{item.discount_per_item * item.quantity}</p>
              )}
            </div>
            <p>৳{item?.price}</p>
            <p>{item?.quantity}</p>
            <div className='flex justify-center gap-4 text-xl'>
              <button title="Decrease" onClick={() => decreaseQuantity(item?.product_id)} className='text-orange-500 cursor-pointer'>
                <FaMinus />
              </button>
              <button title="Remove" onClick={() => removeFromCart(item?.product_id)} className='text-red-500 cursor-pointer'>
                <MdDeleteOutline />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={placeOrder} className='w-full bg-gray-50 p-6 rounded-lg flex flex-col gap-4 mt-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-1'>
            <label htmlFor="name" className='font-medium'>Customer Name</label>
            <input type="text" id='name' name='name' required onChange={handleChange} value={formData.name} className='w-full px-3 p-2 border border-black/10 rounded outline-none bg-white' placeholder='Walk-in Customer' />
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor="phone" className='font-medium'>Phone Number</label>
            <input type="text" id='phone' name='phone' required onChange={handleChange} value={formData.phone} className='w-full px-3 p-2 border border-black/10 rounded outline-none bg-white' placeholder='017...' />
          </div>
        </div>

        <div className='w-full flex flex-col gap-2 border-t pt-4'>
          <div className='flex justify-between'>
            <p>SubTotal (Original)</p>
            <p>৳{formData.subTotal.toFixed(2)}</p>
          </div>
          <div className='flex justify-between text-green-600 font-medium'>
            <p>Total Savings</p>
            <p>- ৳{formData.discount.toFixed(2)}</p>
          </div>
          <div className='flex justify-between text-xl font-bold border-t pt-2'>
            <p>Net Payable</p>
            <p>৳{formData.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className='flex flex-col md:flex-row items-center justify-between gap-4 mt-2'>
          <div className='flex items-center gap-2'>
            <label className='font-medium'>Payment Method:</label>
            <select name="paymentMethod" required onChange={handleChange} value={formData.paymentMethod} className='p-2 border rounded'>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="card">Card</option>
            </select>
          </div>
          
          {formData.paymentMethod !== 'cash' && (
             <input type="text" name="transactionId" placeholder="Transaction ID" onChange={handleChange} value={formData.transactionId} className='p-2 border rounded outline-none' />
          )}

          <button className='bg-pink-500 hover:bg-pink-600 p-2 px-8 text-white font-bold rounded-full transition-colors cursor-pointer' type='submit'>
            Place Order
          </button>
        </div>
      </form>
    </div>
  )
}

export default Cart