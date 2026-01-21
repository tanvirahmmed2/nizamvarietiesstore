'ue client'
import React, { useMemo } from 'react'

const TotalAnalytics = ({ data }) => {
  const totalPrice = useMemo(() => {
    let total = 0
    data.forEach(item => {
      total += Number(item.totalPrice) || 0

    });
    return total
  }, [data])
  
  const totalWholeSalePrice = useMemo(() => {
    let total = 0
    data.forEach(item => {
      total += Number(item.totalWholeSalePrice) || 0

    });
    return total
  }, [data])

  const totalItems = useMemo(() => {
    let items = 0
    data.forEach(item => {
      items += Number(item.items.length) || 0

    })
    return items
  }, [data])
  return (
    <div className='w-full flex-col flex items-center justify-center gap-2 p-2 border rounded-lg'>
      <h1 className='text-xl font-semibold'>Total Analytics</h1>
      <p>Order Sold : {data.length}</p>
      <p>Total item sold: {totalItems}</p>
      <p><strong>Total Sold:</strong> BDT {totalPrice.toFixed(2)}</p>
      <p><strong>Total Revenue:</strong> BDT {totalPrice.toFixed(2)-totalWholeSalePrice.toFixed(2)}</p>
    </div>
  )
}

export default TotalAnalytics
