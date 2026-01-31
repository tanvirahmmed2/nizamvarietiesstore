'use client'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'
import axios from 'axios'


const AddProductForm = () => {

    const { setIsCategoryBox, setIsBrandBox, categories, brands}= useContext(Context)

    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        categoryId: '',
        brandId: '',
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
            const newData= new FormData()
            newData.append('name', formData.name)
            newData.append('categoryId', formData.categoryId)
            newData.append('barcode', formData.barcode)
            newData.append('brandId', formData.brandId)
            newData.append('stock', formData.stock)
            newData.append('unit', formData.unit)
            newData.append('purchasePrice', formData.purchasePrice)
            newData.append('salePrice', formData.salePrice)
            newData.append('discountPrice', formData.discountPrice)
            newData.append('wholeSalePrice', formData.wholeSalePrice)
            newData.append('retailPrice', formData.retailPrice)
            newData.append('dealerPrice', formData.dealerPrice)
            newData.append('description', formData.description)
            newData.append('image', formData.image)

            const response= await axios.post('/api/product', newData, {withCredentials:true})
            toast.success(response.data.message)
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
                        <input type="text" name='name' id='name' required value={formData.name} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="barcode">Barcode *</label>
                        <input type="text" name='barcode' id='barcode' required value={formData.barcode} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                </div>


                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-row items-center justify-between gap-2'>
                        <div className='w-full flex flex-col gap-1'>
                            <label htmlFor="category">Category *</label>
                            <select name='categoryId' id='categoryId' required value={formData.categoryId} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '>
                                <option value="">select</option>
                                {
                                    categories.length >0 && categories.map((cat)=>(
                                        <option value={cat.category_id} key={cat.name}>{cat.name}</option>
                                    ))
                                }
                            </select>

                        </div>
                        <button type='button'  className='text-center p-2 bg-sky-600 text-white rounded-full' onClick={()=>setIsCategoryBox(true)}>Add</button>
                    </div>
                    <div className='w-full flex flex-row items-center justify-between gap-2'>
                        <div className='w-full flex flex-col gap-1'>
                            <label htmlFor="brand">Brand</label>
                            <select name='brandId' id='brandId' value={formData.brandId} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '>
                                <option value="">select</option>
                                {
                                    brands.length >0 &&brands.map((brand)=>(
                                        <option value={brand.brand_id} key={brand.name}>{brand.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <button type='button' className='text-center p-2 bg-sky-600 text-white rounded-full' onClick={()=>setIsBrandBox(true)}>Add</button>
                    </div>

                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="unit">Unit *</label>
                        <input type="text" name='unit' id='unit' required value={formData.unit} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="stock">Stock *</label>
                        <input type="number" name='stock' id='stock' required value={formData.stock} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                </div>


                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="purchasePrice">Purchase Price *</label>
                        <input type="number" name='purchasePrice' id='purchasePrice' required value={formData.purchasePrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="salePrice">Sale Price *</label>
                        <input type="number" name='salePrice' id='salePrice' required value={formData.salePrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="discountPrice">Discount</label>
                        <input type="number" name='discountPrice' id='discountPrice' value={formData.discountPrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                </div>


                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="retailPrice">Retail Price</label>
                        <input type="number" name='retailPrice' id='retailPrice' value={formData.retailPrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="wholeSalePrice">Whole Sale Price *</label>
                        <input type="number" name='wholeSalePrice' id='wholeSalePrice' required value={formData.wholeSalePrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="dealerPrice">Dealer Price</label>
                        <input type="number" name='dealerPrice' id='dealerPrice' value={formData.dealerPrice} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="description">Description *</label>
                        <textarea name="description" id="description" required value={formData.description} onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '></textarea>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="image">Image *</label>
                        <input type="file" name='image' id='image' accept='image/*' required onChange={handleChange} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                    </div>
                </div>
                <button className='w-auto px-8 p-1 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-500 ' type='submit'>Submit</button>
            </form>

        </div>
    )
}

export default AddProductForm
