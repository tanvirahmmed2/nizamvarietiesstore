'use client'
import AddPurchaseForm from '@/components/forms/AddPurchaseForm'
import AddSupplierForm from '@/components/forms/AddSupplierForm'
import { Context } from '@/components/helper/Context'
import React, { useContext } from 'react'

const PurchasePage = () => {
  const { isSupplierBox } = useContext(Context)

  return (
    <div className="w-full relative">
      
      {isSupplierBox && (
        <div className='fixed inset-0 z-200 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
            <AddSupplierForm />
          </div>
        </div>
      )}

      <AddPurchaseForm />
    </div>
  )
}

export default PurchasePage
