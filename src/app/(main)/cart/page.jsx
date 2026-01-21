'use client'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect, useState } from 'react'
import { MdDeleteOutline } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const { cart, removeFromCart,  decreaseQuantity, clearCart } = useContext(Context)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subTotal: 0,
    discount: 0,
    totalPrice: 0,
    paymentMethod: 'cash',
    items: cart?.items
  })


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const subTotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const discount = 0 

    const totalPrice = subTotal - discount
    setFormData(prev => ({
    ...prev,
    subTotal,
    discount,
    totalPrice,
    items: cart.items
  }))

  }, [cart.items ])



  const placeOrder = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/order', formData, { withCredentials: true })
      toast.success(response.data.message)
      clearCart()
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to place order')

    }
  }



  if (cart === 'undefined' || cart?.items.length < 1) return <div className='w-full'>
    <p className='w-full text-center'>No cart data found</p>
  </div>


  return (
    <div className='w-full flex flex-col items-center justify-center gap-4 '>
      <h1 className='text-4xl font-semibold'>Cart</h1>

      <button onClick={clearCart} className='font-semibold uppercase cursor-pointer'>Clear Cart</button>
      <div className='w-full flex flex-col items-center justify-center gap-4'>
        <div className='w-full flex flex-col items-center justify-center border gap-2'>
          <div className='w-full flex flex-row items-center justify-between p-4'>
            <p className=''>Title</p>
            <p className=''>Quantity</p>

          </div>
          <div className='w-full flex flex-row items-center justify-between p-4'>
            <p className=''>Price</p>
            <p className='' >Remove</p>
            <p className='' >Delete</p>

          </div>

        </div>
        {
          cart?.items.map((item) => (
            <div key={item?.productId} className='w-full flex  flex-col  items-center justify-center border gap-2'>
              <div className='w-full flex flex-row items-center justify-between p-4'>
                <p className=''>{item?.title}</p>
                <p className=''>{item?.quantity}</p>

              </div>
              <div className='w-full flex flex-row items-center justify-between p-4'>
                <p className=''>৳{item?.price}</p>
                <p className='' onClick={() => decreaseQuantity(item?.productId)}><FaMinus /></p>
                <p className='' onClick={() => removeFromCart(item?.productId)}><MdDeleteOutline /></p>

              </div>
            </div>
          ))
        }
      </div>

      <form onSubmit={placeOrder} className='w-full flex flex-col items-center justify-center gap-2'>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="name">Name</label>
          <input type="text" id='name' name='name' required onChange={handleChange} value={formData.name} className='w-full px-3 p-1 border border-black/10 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="phone">Phone</label>
          <input type="number" id='phone' name='phone' required onChange={handleChange} value={formData.phone} className='w-full px-3 p-1 border border-black/10 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>

          <div className='w-full flex flex-row items-center justify-between '>
            <p>SubTotal</p>
            <p>{formData.subTotal}</p>
          </div>
          <div className='w-full flex flex-row items-center justify-between '>
            <p>Discount</p>
            <p>{formData.discount}</p>
          </div>
          <div className='w-full flex flex-row items-center justify-between '>
            <p>Total</p>
            <p>{formData.totalPrice}</p>
          </div>
          <div className='w-full flex flex-row items-center justify-between '>
            <p>Payment via</p>
            <select name="paymentMethod" id="paymentMethod" required onChange={handleChange} value={formData.paymentMethod}>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="card">Card</option>
            </select>
          </div>

        </div>

        <button className='bg-pink-400 p-1 px-4 text-white cursor-pointer' type='submit'>Place Order</button>
      </form>

    </div>
  )
}

export default Cart
