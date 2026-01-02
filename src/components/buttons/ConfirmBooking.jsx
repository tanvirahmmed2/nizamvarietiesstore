'use client'
import React from 'react'
import { GiConfirmed } from "react-icons/gi";

const ConfirmBooking = ({id}) => {
    const confirmReservation=async()=>{

    }
  return (
    <button className='text-xl cursor-pointer' onClick={confirmReservation}><GiConfirmed/></button>
  )
}

export default ConfirmBooking
