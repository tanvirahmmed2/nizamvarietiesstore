'use client'
import AddCategoryForm from '@/components/forms/AddCategoryForm'
import EditCategoryForm from '@/components/forms/EditCategoryForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { RiAddLine, RiSearchLine, RiArchiveLine } from 'react-icons/ri'
import { MdEdit, MdDeleteOutline } from 'react-icons/md'
import { toast } from 'react-hot-toast'

const CategoryPage = () => {
  const { categories, fetchCategory, isCategoryBox, setIsCategoryBox } = useContext(Context)
  const [loadingId, setLoadingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)

  const removeCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setLoadingId(id)
    try {
      const response = await axios.delete('/api/category', { data: { id }, withCredentials: true })
      toast.success(response.data.message)
      fetchCategory()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove category')
    } finally {
      setLoadingId(null)
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(cat.category_id).includes(searchTerm)
  )

  return (
    <div className='w-full flex flex-col gap-4 bg-slate-50 min-h-screen relative'>
      {/* Top Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Category Management</h1>
          <p className='text-sm text-slate-500 mt-1'>Organize your products into categories</p>
        </div>
        <div className='w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          {categories.length > 0 && (
            <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-3 py-2.5 rounded-xs text-center whitespace-nowrap">
              Total: {categories.length} Categories
            </span>
          )}
          <div className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xs border border-slate-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100/50 transition-all sm:w-72'>
            <RiSearchLine className='text-slate-400 text-lg' />
            <input
              type="text"
              placeholder="Search category by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400'
            />
          </div>
          <button 
            onClick={() => setIsCategoryBox(true)}
            className='flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xs font-medium transition-colors shadow-xs active:scale-95 whitespace-nowrap cursor-pointer'
          >
            <RiAddLine size={20} />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Table Header Row */}
      <div className="grid grid-cols-12 gap-2 sm:gap-3 px-4 sm:px-5 py-3 bg-white border border-slate-200 rounded-xs font-bold text-slate-500 text-[11px] sm:text-xs uppercase tracking-wider shadow-xs items-center">
        <div className="col-span-3 sm:col-span-2 lg:col-span-2">Category ID</div>
        <div className="col-span-6 sm:col-span-7 lg:col-span-8">Category Name</div>
        <div className="col-span-3 sm:col-span-3 lg:col-span-2 text-right">Actions</div>
      </div>

      {/* Category List */}
      <div className='w-full flex flex-col gap-2.5 '>
        {filteredCategories.length === 0 ? (
          <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
            <div className='w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400'>
              <RiArchiveLine size={32} />
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>No Categories Found</p>
              <p className='text-slate-400 text-sm mt-1'>Try adjusting your search query or add a new category.</p>
            </div>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat.category_id}
              className="w-full border border-slate-200 rounded-xs shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-3 sm:p-4 lg:py-3 lg:px-5 bg-white relative"
            >
              <div className='grid grid-cols-12 gap-2 sm:gap-3 items-center'>
                {/* 1. ID */}
                <div className='col-span-3 sm:col-span-2 lg:col-span-2 flex items-center justify-start'>
                  <span className='text-xs font-mono font-bold text-slate-900 bg-slate-100 px-1.5 sm:px-2 py-1 rounded-md truncate'>
                    #{cat.category_id}
                  </span>
                </div>

                {/* 2. Category Name */}
                <div className='col-span-6 sm:col-span-7 lg:col-span-8 font-semibold text-slate-800 text-xs sm:text-sm truncate'>
                  {cat.name}
                </div>

                {/* 3. Actions */}
                <div className='col-span-3 sm:col-span-3 lg:col-span-2 flex items-center justify-end gap-1'>
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className='p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer'
                    title="Edit Category"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button 
                    disabled={loadingId === cat.category_id}
                    onClick={() => removeCategory(cat.category_id)}
                    className='p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer'
                    title="Delete Category"
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Form Modal */}
      {isCategoryBox && (
        <div className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
            <AddCategoryForm />
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingCategory && (
        <div className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
            <EditCategoryForm 
              categoryToEdit={editingCategory} 
              onClose={() => setEditingCategory(null)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryPage
