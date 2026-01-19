'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useCart } from '../context/Context'
import { MdOutlineSystemUpdateAlt } from "react-icons/md";


const productSize=['NB', 'S', 'M', 'L', 'XL']



const AddProduct = () => {
    const {  categories, fetchCategory } = useCart()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        size: '',
        category: '',
        image: null,
        wholeSalePrice: '',
        quantity: '',


    })

    const [category, setCategory]= useState('')
    const addNewCategory = async () => {
    try {
      const response= await axios.post('/api/category', {title:category}, {withCredentials:true})
      toast.success(response.data.message)
      setCategory('')
      fetchCategory()
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to perform action')
    }
  }


    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (files) {
            setFormData({ ...formData, image: files[0] })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const addNewProduct = async (e) => {
        e.preventDefault()
        try {
            const newData = new FormData()
            newData.append('title', formData.title)
            newData.append('description', formData.description)
            newData.append('price', formData.price)
            newData.append('category', formData.category)
            newData.append('image', formData.image)
            newData.append('size', formData.size)
            newData.append('wholeSalePrice', formData.wholeSalePrice)
            newData.append('quantity', formData.quantity)

            const response = await axios.post('/api/product', newData, { withCredentials: true })
            toast.success(response.data.message)
            setFormData({
                title: '',
                description: '',
                price: '',
                size: '',
                category: '',
                image: null,
                wholeSalePrice: '',
                quantity: '',

            })

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Failed to add product')
        }

    }
    return (
        <form onSubmit={addNewProduct} className='w-full flex flex-col items-center justify-center gap-4 border-b-2 border-black/10 p-4'>
            <h1 className='text-xl font-semibold'>Add New Product</h1>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="title">Title</label>
                <input type="text" name='title' id='title' required value={formData.title} onChange={handleChange} className='w-full p-1 px-3 outline-none border-2 border-black/10 rounded-lg shadow-sm' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="description">Description</label>
                <input type="text" name='description' id='description' required value={formData.description} onChange={handleChange} className='w-full p-1 px-3 outline-none border-2 border-black/10 rounded-lg shadow-sm' />
            </div>


            <div className='w-full flex flex-col md:flex-row items-center justify-between gap-2'>
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="category">Category</label>
                    <select name="category" id="category" required value={formData.category} onChange={handleChange} className='w-full p-1 px-3 outline-none border-2 border-black/10 rounded-lg shadow-sm'>
                        <option value="">--Select--</option>
                        {categories && categories.map((cat) => (
                            <option value={cat.title} key={cat._id}>{cat.title}</option>
                        ))}
                    </select>
                </div>


                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="category">New Category</label>
                    <div className='w-full flex flex-row items-center justify-between gap-4'>
                        <input type="text" required value={category} id='category' name='category' onChange={(e) => { setCategory(e.target.value) }} className='w-full p-1 px-3 outline-none border-2 border-black/10 rounded-lg shadow-sm'  />
                        <button onClick={addNewCategory} className='px-4 p-1 bg-sky-400 text-center rounded-lg hover:scale-[1.02] transform ease-in-out duration-500 cursor-pointer text-white'><MdOutlineSystemUpdateAlt /></button>
                    </div>
                </div>
            </div>


            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="size">Size</label>
                <select name='size' id='size' required value={formData.size}  onChange={handleChange} className='w-full p-1 px-3 outline-none border-2 border-black/10 rounded-lg shadow-sm' >
                        <option value="">Select</option>
                        {
                            productSize?.map((s)=>(
                                <option value={s} key={s}>{s}</option>
                            ))
                        }
                </select>
               
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="price">Price</label>
                <input type="number" name='price' id='price' min={0} required value={formData.price} onChange={handleChange} className='w-full p-1 px-3 outline-none border-2 border-black/10 rounded-lg shadow-sm' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="wholeSalePrice">Whole Sale Price</label>
                <input type="number" name='wholeSalePrice' id='wholeSalePrice' min={0} required value={formData.wholeSalePrice} onChange={handleChange} className='w-full p-1 px-3 outline-none border-2 border-black/10 rounded-lg shadow-sm' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="quantity">Quantity</label>
                <input type="number" name='quantity' id='quantity' min={0} required value={formData.quantity} onChange={handleChange} className='w-full p-1 px-3 outline-none border-2 border-black/10 rounded-lg shadow-sm' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="image">Image</label>
                <input type="file" accept='image/*' required name='image' onChange={handleChange} id='image' className='w-full p-1 px-3 outline-none border-2 border-black/10 rounded-lg shadow-sm' />
            </div>
            <button type='submit' className='bg-sky-400 text-white p-1 px-4 rounded-lg shadow-sm cursor-pointer'>Submit</button>

        </form>
    )
}

export default AddProduct
