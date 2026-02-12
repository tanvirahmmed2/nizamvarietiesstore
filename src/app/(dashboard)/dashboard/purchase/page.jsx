'use client'
import AddPurchaseForm from '@/components/forms/AddPurchaseForm'
import AddSupplierForm from '@/components/forms/AddSupplierForm'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect, useState } from 'react'

const PurchasePage = () => {
  const {isSupplierBox}= useContext(Context)




  return (
    <div className="w-full p-4 flex flex-col md:flex-row relative">
        <div  className={`absolute ${isSupplierBox?'block': 'hidden'} z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white min-w-100 border p-4 rounded-xl shadow-lg`}>
          <AddSupplierForm/>
        </div>
      <AddPurchaseForm />
      
    </div>
  )
}

export default PurchasePage
