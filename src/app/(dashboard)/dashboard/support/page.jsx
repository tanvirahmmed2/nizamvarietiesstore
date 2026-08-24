'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MdDelete } from 'react-icons/md'

const SupportPage = () => {
    const [supports, setSupports] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchSupport = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/support', { withCredentials: true })
            setSupports(response.data.payload || [])
        } catch (error) {
            console.error("Support fetch error:", error)
            setSupports([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSupport()
    }, [])

    const removeSupport = async (id) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            const response = await axios.delete('/api/support', { data: { id }, withCredentials: true })
            toast.success(response.data.message)
            fetchSupport()
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to remove support")
        }
    }
    
    return (
        <div className='w-full flex flex-col gap-4 bg-slate-50 min-h-screen relative'>
            
            {/* Header */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
                <div>
                    <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Support Messages</h1>
                    <p className='text-sm text-slate-500 mt-1'>Review and manage customer support inquiries</p>
                </div>
                {supports.length > 0 && (
                    <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 px-3 py-2.5 rounded-xs text-center whitespace-nowrap border border-sky-100">
                        Total: {supports.length} Messages
                    </span>
                )}
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 sm:gap-3 px-4 sm:px-5 py-3 bg-white border border-slate-200 rounded-xs font-bold text-slate-500 text-[11px] sm:text-xs uppercase tracking-wider shadow-xs items-center">
                <div className="col-span-4 sm:col-span-3">Customer</div>
                <div className="col-span-7 sm:col-span-8">Subject & Message</div>
                <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Support List */}
            <div className='w-full flex flex-col gap-2.5'>
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 bg-white animate-pulse rounded-xs border border-slate-200"></div>
                        ))}
                    </div>
                ) : supports.length === 0 ? (
                    <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
                        <p className='text-slate-600 font-semibold'>No Support Messages Found</p>
                        <p className='text-slate-400 text-sm mt-1'>Everything is clear!</p>
                    </div>
                ) : supports.map((e) => (
                    <div 
                        key={e.support_id} 
                        className='w-full border border-slate-200 rounded-xs shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-3 sm:p-4 bg-white'
                    >
                        <div className='grid grid-cols-12 gap-2 sm:gap-3 items-center'>
                            
                            {/* Customer */}
                            <div className='col-span-4 sm:col-span-3 flex flex-col justify-center min-w-0 pr-2'>
                                <p className='font-bold text-slate-800 text-xs sm:text-sm truncate'>{e.name || 'Anonymous'}</p>
                                <p className='text-[10px] sm:text-[11px] text-slate-500 font-mono truncate'>{e.email || 'N/A'}</p>
                            </div>

                            {/* Message & Subject */}
                            <div className='col-span-7 sm:col-span-8 flex flex-col justify-center min-w-0 pr-2'>
                                <p className='font-bold text-slate-800 text-xs truncate'>{e.subject || 'No Subject'}</p>
                                <p className='text-xs text-slate-600 line-clamp-2 mt-0.5'>{e.message}</p>
                            </div>

                            {/* Action */}
                            <div className='col-span-1 flex items-center justify-end'>
                                <button 
                                    onClick={() => removeSupport(e.support_id)}
                                    className='p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer'
                                    title="Delete Message"
                                >
                                    <MdDelete size={18} />
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SupportPage

