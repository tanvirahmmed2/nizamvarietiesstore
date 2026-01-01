import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const Reservation = async() => {
    const res = await fetch(`${BASE_URL}/api/reservation`, { method: 'GET', cache: 'no-store' })
      const data = await res.json()
      if (!data.success) return <div className='w-full flex items-center justify-center'>
        <p>No data found</p>
      </div>
      const reservations = data.payload
  return (
    <div>
      
    </div>
  )
}

export default Reservation
