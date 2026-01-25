'use client'
import React, { useState } from 'react'

const RetailerForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        logo: null,
        description: '',
        tagline: '',
        phone: '',
        email: '',
        facebook: '',
        address: ''
    })

    const changeHandler = (e) => {
        const { name, value, files } = e.target
        if (files) {
            setFormData({ ...formData, logo: files[0] })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const submitRetailerData = async (e) => {
        e.preventDefault()

    }
    return (
        <form onSubmit={submitRetailerData} className='w-full flex flex-col gap-4'>
            <h1 className='w-full text-center'>Add New Retailer Data</h1>
            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-3'>
                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required value={formData.title} onChange={changeHandler}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                </div>

                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="logo">Logo</label>
                    <input type="file" name="logo" id="logo" required onChange={changeHandler}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                </div>

            </div>

            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="Description">Description</label>
                <textarea name="description" id="description" required value={formData.description} onChange={changeHandler} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '></textarea>
            </div>

            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-3'>
                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="tagline">Tagline</label>
                    <input type="text" name="tagline" id="tagline" required value={formData.tagline} onChange={changeHandler}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                </div>

                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="address">Address</label>
                    <input type="text" name="address" id="address" required onChange={changeHandler} value={formData.address}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                </div>

            </div>

            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-3'>
                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="phone">Phone</label>
                    <input type="text" name="phone" id="phone" required value={formData.phone} onChange={changeHandler}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                </div>

                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" required onChange={changeHandler} value={formData.email}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                </div>

                <div className='w-full flex flex-col gap-1'>
                    <label htmlFor="facebook">Facebook</label>
                    <input type="text" name="facebook" id="facebook" required onChange={changeHandler} value={formData.facebook}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
                </div>

            </div>
            <button className='w-auto px-8 p-1 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-500 ' type='submit'>Submit</button>
        </form>
    )
}

export default RetailerForm
