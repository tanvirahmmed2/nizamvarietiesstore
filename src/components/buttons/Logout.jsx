'use client'
import React from 'react'

import { CiLogout } from "react-icons/ci";

const Logout = () => {
  return (
    <button className='w-full flex flex-row items-center justify-between gap-3 cursor-pointer'><CiLogout/> Logout</button>
  )
}

export default Logout
