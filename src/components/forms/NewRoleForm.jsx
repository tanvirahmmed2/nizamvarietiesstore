'use client'
import React, { useState } from 'react'

const NewRoleForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: ''
    })

    const changeHandler = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const submitNewRole = async (e) => {
        e.preventDefault()

    }
    return (
        <form onSubmit={submitNewRole} className='w-full flex flex-col items-center gap-4'>
            <h1>Add New Role</h1>
            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-3'>
                <div className='w-full flex flex-col gap-1 '>
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' id='name' required value={formData.name} onChange={changeHandler}   className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                </div>
                <div className='w-full flex flex-col gap-1 '>
                    <label htmlFor="role">Role</label>
                    <select name="role" id="role" required value={formData.role} onChange={changeHandler}  className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '>
                        <option value="">select</option>
                        <option value="manager">Manager</option>
                        <option value="sales">Sales</option>
                    </select>
                </div>
            </div>


            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-3'>
                <div className='w-full flex flex-col gap-1 '>
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' id='email' required value={formData.email} onChange={changeHandler}   className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                </div>
                <div className='w-full flex flex-col gap-1 '>
                    <label htmlFor="phone">Phone</label>
                    <input type="text" name='phone' id='phone' required value={formData.phone} onChange={changeHandler}   className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
                </div>
            </div>

            <div className='w-full flex flex-col gap-1 '>
                <label htmlFor="password">Password</label>
                <input type="password" name='password' id='password' required value={formData.password} onChange={changeHandler}    className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '/>
            </div>

             <button className='w-auto px-8 p-1 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-500 ' type='submit'>Submit</button>
        </form>
    )
}

export default NewRoleForm
