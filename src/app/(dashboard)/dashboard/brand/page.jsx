'use client'
import AddBrandForm from '@/components/forms/AddBrandForm'
import EditBrandForm from '@/components/forms/EditBrandForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { RiAddLine, RiSearchLine, RiArchiveLine } from 'react-icons/ri'
import { MdEdit, MdDeleteOutline } from 'react-icons/md'
import { toast } from 'react-hot-toast'

const BrandPage = () => {
  const { brands, fetchBrand, isBrandBox, setIsBrandBox } = useContext(Context)
  const [loadingId, setLoadingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingBrand, setEditingBrand] = useState(null)

  const removeBrand = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    setLoadingId(id)
    try {
      const response = await axios.delete('/api/brand', { data: { id }, withCredentials: true })
      toast.success(response.data.message)
      fetchBrand()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove brand')
    } finally {
      setLoadingId(null)
    }
  }

  const filteredBrands = brands.filter((brand) =>
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(brand.brand_id).includes(searchTerm)
  )

  return (
    <div className='w-full flex flex-col gap-4 bg-slate-50 min-h-screen relative'>
      {/* Top Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Brand Management</h1>
          <p className='text-sm text-slate-500 mt-1'>Manage your product brands and manufacturers</p>
        </div>
        <div className='w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          {brands.length > 0 && (
            <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-3 py-2.5 rounded-xs text-center whitespace-nowrap">
              Total: {brands.length} Brands
            </span>
          )}
          <div className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xs border border-slate-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100/50 transition-all sm:w-72'>
            <RiSearchLine className='text-slate-400 text-lg' />
            <input
              type="text"
              placeholder="Search brand by name, desc or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400'
            />
          </div>
          <button 
            onClick={() => setIsBrandBox(true)}
            className='flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xs font-medium transition-colors shadow-xs active:scale-95 whitespace-nowrap cursor-pointer'
          >
            <RiAddLine size={20} />
            <span>Add New Brand</span>
          </button>
        </div>
      </div>

      {/* Table Header Row */}
      <div className="grid grid-cols-12 gap-2 sm:gap-3 px-4 sm:px-5 py-3 bg-white border border-slate-200 rounded-xs font-bold text-slate-500 text-[11px] sm:text-xs uppercase tracking-wider shadow-xs items-center">
        <div className="col-span-2 sm:col-span-2 lg:col-span-1">Brand ID</div>
        <div className="col-span-4 sm:col-span-4 lg:col-span-4">Brand Name</div>
        <div className="col-span-4 sm:col-span-4 lg:col-span-5">Description</div>
        <div className="hidden lg:block lg:col-span-1 text-center">Status</div>
        <div className="col-span-2 sm:col-span-2 lg:col-span-1 text-right">Actions</div>
      </div>

      {/* Brand List */}
      <div className='w-full flex flex-col gap-2.5 '>
        {filteredBrands.length === 0 ? (
          <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
            <div className='w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400'>
              <RiArchiveLine size={32} />
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>No Brands Found</p>
              <p className='text-slate-400 text-sm mt-1'>Try adjusting your search query or add a new brand.</p>
            </div>
          </div>
        ) : (
          filteredBrands.map((brand) => (
            <div
              key={brand.brand_id}
              className="w-full border border-slate-200 rounded-xs shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-3 sm:p-4 lg:py-3 lg:px-5 bg-white relative"
            >
              <div className='grid grid-cols-12 gap-2 sm:gap-3 items-center'>
                {/* 1. ID */}
                <div className='col-span-2 sm:col-span-2 lg:col-span-1 flex items-center justify-start'>
                  <span className='text-xs font-mono font-bold text-slate-900 bg-slate-100 px-1.5 sm:px-2 py-1 rounded-md truncate'>
                    #{brand.brand_id}
                  </span>
                </div>

                {/* 2. Brand Name */}
                <div className='col-span-4 sm:col-span-4 lg:col-span-4 font-semibold text-slate-800 text-xs sm:text-sm truncate'>
                  {brand.name}
                </div>

                {/* 3. Description */}
                <div className='col-span-4 sm:col-span-4 lg:col-span-5 text-slate-600 text-xs sm:text-sm truncate'>
                  {brand.description || <span className="text-slate-400 italic">No description</span>}
                </div>

                {/* 4. Status (Hidden on smaller screens) */}
                <div className='hidden lg:flex lg:col-span-1 items-center justify-center'>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    brand.is_active !== false ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {brand.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* 5. Actions */}
                <div className='col-span-2 sm:col-span-2 lg:col-span-1 flex items-center justify-end gap-1'>
                  <button
                    onClick={() => setEditingBrand(brand)}
                    className='p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer'
                    title="Edit Brand"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button 
                    disabled={loadingId === brand.brand_id}
                    onClick={() => removeBrand(brand.brand_id)}
                    className='p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer'
                    title="Delete Brand"
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
      {isBrandBox && (
        <div className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
            <AddBrandForm />
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingBrand && (
        <div className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
            <EditBrandForm 
              brandToEdit={editingBrand} 
              onClose={() => setEditingBrand(null)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default BrandPage
