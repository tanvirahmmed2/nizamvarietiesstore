'use client'
import { useCart } from '@/components/context/Context'
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react'
import { FiSave } from "react-icons/fi";
import { toast } from 'react-toastify';

const Update = () => {

    const { userData } = useCart()

    const [formData, setFormData] = useState({
        id: userData?._id,
        name: userData?.name || '',
        address: userData?.address || '',
        phone: userData?.phone || '',
        email: userData?.email || "",
        password: ''

    })

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const changeName = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/user/update/name', { id: formData.id, name: formData.name }, { withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)

        }
    }
    const changePassword = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/user/update/password', { id: formData.id, password: formData.password }, { withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)

        }
    }
    const changeAddress = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/user/update/address', { id: formData.id, address: formData.address }, { withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)

        }
    }
    const changePhone = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/user/update/phone', { id: formData.id, phone: formData.phone }, { withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)

        }
    }
    const changeEmail = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/user/update/email', { id: formData.id, email: formData.email }, { withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)

        }
    }



    if (!userData || userData == null) return <p>Please login first</p>



    return (
        <div className='w-full min-h-screen flex items-center justify-center p-4'>
            <div className='w-full md:w-1/2 flex flex-col items-center justify-center gap-4 border border-red-500 rounded-lg py-4'>
                <h1 className='text-2xl font-semibold'>{userData.name}</h1>
                <form onSubmit={changeName} className='w-full flex flex-col gap-2 p-2'>
                    <label htmlFor="name">Name</label>
                    <div className='w-full flex flex-row gap-4'>
                        <input type="text" id='name' name='name' className='w-full outline-none px-3 p-1 bg-white border text-black ' required onChange={handleChange} value={formData.name} />
                        <button type='submit' className='text-2xl cursor-pointer'><FiSave /></button>
                    </div>
                </form>
                <form onSubmit={changeEmail} className='w-full flex flex-col gap-2 p-2'>
                    <label htmlFor="email">Email</label>
                    <div className='w-full flex flex-row gap-4'>
                        <input type="email" id='email' name='email' className='w-full outline-none px-3 p-1 bg-white border text-black ' required onChange={handleChange} value={formData.email} />
                        <button type='submit' className='text-2xl cursor-pointer'><FiSave /></button>
                    </div>
                </form>
                <form onSubmit={changePhone} className='w-full flex flex-col gap-2 p-2'>
                    <label htmlFor="phone">Phone</label>
                    <div className='w-full flex flex-row gap-4'>
                        <input type="text" id='phone' name='phone' className='w-full outline-none px-3 p-1 bg-white border text-black ' required onChange={handleChange} value={formData.phone} />
                        <button type='submit' className='text-2xl cursor-pointer'><FiSave /></button>

                    </div>
                </form>
                <form onSubmit={changeAddress} className='w-full flex flex-col gap-2 p-2'>
                    <label htmlFor="address">Address</label>
                    <div className='w-full flex flex-row gap-4'>

                        <input type="text" id='address' name='address' className='w-full outline-none px-3 p-1 bg-white border text-black ' required onChange={handleChange} value={formData.address} />
                        <button type='submit' className='text-2xl cursor-pointer'><FiSave /></button>
                    </div>
                </form>
                <form onSubmit={changePassword} className='w-full flex flex-col gap-2 p-2'>
                    <label htmlFor="password">Change Password</label>
                    <div className='w-full flex flex-row gap-4'>
                        <input type="text" name='password' id='password' className='w-full outline-none px-3 p-1 bg-white border text-black ' required onChange={handleChange} value={formData.password} />
                        <button type='submit' className='text-2xl cursor-pointer'><FiSave /></button>
                    </div>
                </form>

                <Link href={'/profile'}>Back to profile</Link>

            </div>
        </div>
    )
}

export default Update
