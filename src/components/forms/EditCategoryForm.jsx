'use client'
import React, { useContext, useState, useEffect } from 'react'
import { RiCloseLine } from "react-icons/ri"
import { Context } from '../helper/Context'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const EditCategoryForm = ({ categoryToEdit, onClose }) => {
    const [name, setName] = useState(categoryToEdit?.name || '')
    const { fetchCategory } = useContext(Context)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name || '')
        }
    }, [categoryToEdit])

    const updateCategory = async (e) => {
        e.preventDefault()
        if (!categoryToEdit?.category_id) return
        setIsSubmitting(true)
        try {
            const response = await axios.put('/api/category', { 
                id: categoryToEdit.category_id, 
                name 
            }, { withCredentials: true })
            toast.success(response.data.message)
            fetchCategory()
            onClose()
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update category")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={updateCategory} className='flex flex-col w-full bg-white'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-slate-100'>
                <h2 className='text-lg font-bold text-slate-800 tracking-tight'>Edit Category</h2>
                <button 
                    type='button' 
                    onClick={onClose} 
                    className='p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer'
                >
                    <RiCloseLine size={24} />
                </button>
            </div>

            {/* Body */}
            <div className='p-6 flex flex-col gap-5'>
                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="category_name" className='text-sm font-semibold text-slate-700'>Category Name <span className='text-rose-500'>*</span></label>
                    <input 
                        type="text" 
                        id='category_name' 
                        required 
                        placeholder="Category name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className='w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400' 
                    />
                </div>
            </div>

            {/* Footer */}
            <div className='p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3'>
                <button 
                    type='button' 
                    onClick={onClose}
                    className='px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-200/50 rounded-xl transition-colors cursor-pointer'
                >
                    Cancel
                </button>
                <button 
                    disabled={isSubmitting}
                    type='submit' 
                    className='px-6 py-2.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors shadow-sm shadow-sky-200 disabled:opacity-50 flex items-center gap-2 cursor-pointer'
                >
                    {isSubmitting ? 'Updating...' : 'Update Category'}
                </button>
            </div>
        </form>
    )
}

export default EditCategoryForm
