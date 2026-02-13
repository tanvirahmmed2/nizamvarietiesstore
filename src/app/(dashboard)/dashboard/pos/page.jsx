'use client'

import AddCutomerForm from "@/components/forms/AddCustomerForm"
import { Context } from "@/components/helper/Context"
import SalesCart from "@/components/page/SalesCart"
import { useContext } from "react"



const PosPage = () => {

  const {isCustomerBox}= useContext(Context)

  return (
    <div className="w-full p-4 flex flex-col md:flex-row relative">
        <div className={`absolute ${isCustomerBox?'block': 'hidden'} z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white min-w-100 border p-4 rounded-xl shadow-lg`}>
          <AddCutomerForm/>
        </div>
      <SalesCart />
      
    </div>
  )
}

export default PosPage