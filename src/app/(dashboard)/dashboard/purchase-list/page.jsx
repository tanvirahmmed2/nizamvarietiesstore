'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash } from 'react-icons/fa6'

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('/api/purchase')
      if (res.data.success) {
        setPurchases(res.data.payload)
      }
    } catch (error) {
      toast.error("Failed to fetch purchases")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will also decrease product stock!")) return
    try {
      const res = await axios.delete('/api/purchase', { data: { id } })
      if (res.data.success) {
        toast.success(res.data.message)
        fetchPurchases()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed")
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  if (loading) return <p className='p-5 text-center'>Loading purchases...</p>

  return (
    <div className='w-full flex flex-col items-center justify-center gap-4 p-4 bg-white rounded-xl'>
      <h2 className='text-xl font-bold mb-4 text-gray-800'>Purchase History</h2>
      <div className='w-full'>
        {purchases.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          {
            purchases.map((item) => (
              <div key={item.purchase_id} className='w-full flex flex-row items-center justify-between p-2 rounded-xl even:bg-gray-100 shadow'>
                <div className='flex-1'>
                  <p className='font-bold text-gray-800'>{item.supplier_name}</p>
                  <p className='text-xs text-gray-500'>Inv: {item.invoice_no || 'N/A'} | {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <div className='flex items-center gap-6'>
                  <div className='text-right'>
                    <p className='font-black text-sky-600'>৳{parseFloat(item.total_amount).toFixed(2)}</p>
                    <p className='text-[10px] uppercase font-bold text-gray-400'>{item.payment_method}</p>
                  </div>
                  <button onClick={() => handleDelete(item.purchase_id)} className='p-2 text-red-400 hover:text-red-600 transition-colors'>
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))
          }
        </div> : <p className='text-center text-gray-400 py-10'>No purchase records found</p>}
      </div>
    </div>
  )
}

export default PurchaseList