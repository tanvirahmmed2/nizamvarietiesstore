'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiCloseLine } from 'react-icons/ri'

const NewStaffForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const changeHandler = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const submitNewRole = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/staff', formData, { withCredentials: true })
            toast.success(response.data.message)
            if (onSuccess) onSuccess()
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add new staff")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={submitNewRole} className='flex flex-col w-full bg-white'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-slate-100'>
                <h2 className='text-lg font-bold text-slate-800 tracking-tight'>Add New Staff</h2>
                <button 
                    type='button' 
                    onClick={onCancel} 
                    className='p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors'
                >
                    <RiCloseLine size={24} />
                </button>
            </div>

            {/* Body */}
            <div className='p-6 flex flex-col gap-5'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="name" className='text-sm font-semibold text-slate-700'>Name <span className='text-rose-500'>*</span></label>
                        <input 
                            type="text" name='name' id='name' required 
                            placeholder="e.g., Jane Smith"
                            value={formData.name} onChange={changeHandler} 
                            className='w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400' 
                        />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="role" className='text-sm font-semibold text-slate-700'>Role <span className='text-rose-500'>*</span></label>
                        <select 
                            name="role" id="role" required 
                            value={formData.role} onChange={changeHandler} 
                            className='w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800 bg-white'
                        >
                            <option value="">Select Role</option>
                            <option value="manager">Manager</option>
                            <option value="sales">Sales</option>
                        </select>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="email" className='text-sm font-semibold text-slate-700'>Email <span className='text-rose-500'>*</span></label>
                        <input 
                            type="email" name='email' id='email' required 
                            placeholder="jane@example.com"
                            value={formData.email} onChange={changeHandler} 
                            className='w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400' 
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="password" className='text-sm font-semibold text-slate-700'>Password <span className='text-rose-500'>*</span></label>
                        <input 
                            type="password" name='password' id='password' required 
                            placeholder="Enter secure password"
                            value={formData.password} onChange={changeHandler} 
                            className='w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400' 
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className='p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3'>
                <button 
                    type='button' 
                    onClick={onCancel}
                    className='px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-200/50 rounded-xl transition-colors'
                >
                    Cancel
                </button>
                <button 
                    disabled={isSubmitting}
                    type='submit' 
                    className='px-6 py-2.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors shadow-sm shadow-sky-200 disabled:opacity-50 flex items-center gap-2'
                >
                    {isSubmitting ? 'Saving...' : 'Save Staff'}
                </button>
            </div>
        </form>
    )
}

export default NewStaffForm
