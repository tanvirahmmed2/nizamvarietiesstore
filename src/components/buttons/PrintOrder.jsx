'use client'
import React from 'react'
import { FaPrint } from "react-icons/fa";

const PrintOrder = () => {
  return (
    <button className='w-full px-2 rounded-lg hover:bg-black/10 p-1 cursor-pointer flex flex-row items-center justify-center gap-4'><FaPrint/></button>
  )
}

export default PrintOrder
