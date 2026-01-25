'use client'
import React, { useState } from 'react'
import { toast } from 'react-toastify'


const UpdateProductForm = () => {

    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        category: '',
        brand: '',
        unit: '',
        stock: '',
        purchasePrice: '',
        salePrice: '',
        discountPrice: '',
        wholeSalePrice: '',
        retailPrice: '',
        dealerPrice: '',
        description: '',
        image: null,
    })

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (files) {
            setFormData({ ...formData, image: files[0] })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const SubmitNewProduct = async (e) => {
        e.preventDefault()
        try {

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Failed to add product")

        }
    }


    return (
        <div className='w-full flex flex-col items-center gap-6'>
            <h1 className='text-center text-2xl font-semibold'>Add New Product</h1>
            <form onSubmit={SubmitNewProduct} className='w-full flex flex-col items-center gap-4'>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="name">Name *</label>
                        <input type="text" name='name' id='name' required value={formData.name} onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="barcode">Barcode *</label>
                        <input type="number" name='barcode' id='barcode' required value={formData.barcode} onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>
                </div>


                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="category">Category *</label>
                        <select name='category' id='category' required value={formData.category} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '>
                            <option value="">select</option>
                        </select>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="brand">Brand</label>
                        <select name='brand' id='brand'  value={formData.brand} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '>
                            <option value="">select</option>
                        </select>
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="unit">Unit *</label>
                        <input type="text" name='unit' id='unit' required value={formData.unit} onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="stock">Stock *</label>
                        <input type="number" name='stock' id='stock' required value={formData.stock} onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>
                </div>


                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="purchasePrice">Purchase Price *</label>
                        <input type="number" name='purchasePrice' id='purchasePrice' required value={formData.purchasePrice} onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="salePrice">Sale Price *</label>
                        <input type="number" name='salePrice' id='salePrice' required value={formData.salePrice} onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="discount">Discount</label>
                        <input type="number" name='discount' id='discount'  value={formData.discount} onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>
                </div>


                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="retailPrice">Retail Price</label>
                        <input type="number" name='retailPrice' id='retailPrice'  value={formData.retailPrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="wholeSalePrice">Whole Sale Price *</label>
                        <input type="number" name='salePrice' id='wholeSalePrice' required value={formData.wholeSalePrice} onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="dealerPrice">Dealer Price</label>
                        <input type="number" name='dealerPrice' id='dealerPrice'  value={formData.dealerPrice} onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="description">Description *</label>
                        <textarea name="description" id="description" required value={formData.description} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '></textarea>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="image">Image *</label>
                        <input type="file" name='image' id='image' required  onChange={handleChange}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                    </div>
                </div>
                <button className='w-auto px-8 p-1 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-500 ' type='submit'>Submit</button>
            </form>

        </div>
    )
}

export default UpdateProductForm
