'use client'
import React, { useState } from 'react'

const AddCategoryForm = () => {
    const [category, setCategory]= useState('')
    
    const addNewCategory=async(e)=>{
        e.preventDefault()
    }
  return (
    <form onSubmit={addNewCategory} className='w-full flex  flex-col items-center justify-center gap-3'>
        <h1>Add New Category</h1>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="category">Category</label>
            <input type="text" id='category' name='category' required value={category} onChange={(e)=>setCategory(e.target.value)} className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' />
        </div>
        <button className='w-auto px-8 p-1 bg-sky-600 hover:bg-sky-500 rounded-full text-white cursor-pointer' type='submit'>Submit</button>
    </form>
  )
}

export default AddCategoryForm
