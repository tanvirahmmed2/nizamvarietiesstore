'use client'
import NewStaffForm from '@/components/forms/NewStaffForm'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiAddLine, RiDeleteBinLine, RiArchiveLine } from 'react-icons/ri'

const RolemanagementPage = () => {
  const [staffs, setStaffs] = useState([])
  const [isStaffBox, setIsStaffBox] = useState(false)
  const [loadingId, setLoadingId] = useState(null)

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/staff', { withCredentials: true })
      setStaffs(response.data.payload)
    } catch (error) {
      console.log(error)
      setStaffs([])
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const removeStaff = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    setLoadingId(id)
    try {
      const response = await axios.delete('/api/staff', { data: { id }, withCredentials: true })
      toast.success(response.data.message)
      fetchStaff()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove staff')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className='w-full max-w-7xl mx-auto flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Staff Management</h1>
          <p className='text-sm text-slate-500 mt-1'>Manage system users and their roles</p>
        </div>
        <button 
          onClick={() => setIsStaffBox(true)}
          className='flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-sky-200 active:scale-95 whitespace-nowrap'
        >
          <RiAddLine size={20} />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* Content */}
      <div className='bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
        {staffs.length === 0 ? (
          <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6'>
            <div className='w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400'>
              <RiArchiveLine size={32} />
            </div>
            <div>
              <p className='text-slate-600 font-semibold'>No Staff Found</p>
              <p className='text-slate-400 text-sm mt-1'>Get started by adding a new staff member.</p>
            </div>
          </div>
        ) : (
          <div className='w-full overflow-x-auto'>
            <table className='w-full text-left border-collapse min-w-[600px]'>
              <thead>
                <tr className='bg-slate-50 border-b border-slate-100'>
                  <th className='py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider'>Name</th>
                  <th className='py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider'>Email</th>
                  <th className='py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider'>Role</th>
                  <th className='py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {staffs.map((staff) => (
                  <tr key={staff.staff_id} className='hover:bg-slate-50/50 transition-colors group'>
                    <td className='py-4 px-6'>
                      <span className='font-semibold text-slate-800'>{staff.name}</span>
                    </td>
                    <td className='py-4 px-6 text-slate-600 text-sm'>
                      {staff.email}
                    </td>
                    <td className='py-4 px-6'>
                      <span className='inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-600 uppercase tracking-wider'>
                        {staff.role}
                      </span>
                    </td>
                    <td className='py-4 px-6 text-right'>
                      <button 
                        disabled={loadingId === staff.staff_id}
                        onClick={() => removeStaff(staff.staff_id)}
                        className='inline-flex items-center justify-center p-2 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50'
                        title="Remove Staff"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isStaffBox && (
        <div className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
            <NewStaffForm 
              onSuccess={() => {
                setIsStaffBox(false)
                fetchStaff()
              }} 
              onCancel={() => setIsStaffBox(false)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RolemanagementPage
