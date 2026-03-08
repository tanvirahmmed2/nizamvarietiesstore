'use client'
import AddPurchaseForm from '@/components/forms/AddPurchaseForm'
import AddSupplierForm from '@/components/forms/AddSupplierForm'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect, useState } from 'react'
import { LuDelete } from 'react-icons/lu'

const PurchasePage = () => {
  const { isSupplierBox, setIsSupplierBox } = useContext(Context)




  return (
    <div className="w-full p-1 sm:p-4 flex flex-col md:flex-row relative ">
      
      {
        isSupplierBox === true && <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white p-2 rounded-2xl relative'>
            <LuDelete className='  cursor-pointer text-2xl absolute top-2 right-2' onClick={() => setIsSupplierBox(false)} />
          <AddSupplierForm />
          </div>
        </div>
      }
      <AddPurchaseForm />

    </div>
  )
}

export default PurchasePage
