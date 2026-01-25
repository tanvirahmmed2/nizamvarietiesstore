'use client'
import AddCategoryForm from '@/components/forms/AddCategoryForm'
import React, { useState } from 'react'

const CategoryPage = () => {
  const [categories, setCategories] = useState([])


  return (
    <div className='w-full flex flex-col items-center p-4'>
      {
        categories.length === 0 ? <div className='w-full min-h-30 flex items-center justify-center text-center'>
          <p className='text-red-500'>Category data not Found !</p>
        </div> : <div>
          {
            categories.map((cat) => (
              <p key={cat}>{cat}</p>
            ))
          }
        </div>
      }
      <AddCategoryForm />
    </div>
  )
}

export default CategoryPage
