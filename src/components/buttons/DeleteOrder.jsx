'use client'
import React from 'react'
import { MdDeleteOutline } from 'react-icons/md'

const DeleteOrder = () => {
  return (
    <button className='w-full px-2 rounded-lg hover:bg-black/10 p-1 cursor-pointer flex flex-row items-center justify-center gap-4'><MdDeleteOutline/></button>
  )
}

export default DeleteOrder
