import { BASE_URL } from '@/lib/database/secret'
import Link from 'next/link'
import React from 'react'
import Item from '../card/Item'

const Latest = async () => {
  const res = await fetch(`${BASE_URL}/api/product/latest`, { method: 'GET', cache: 'no-store' })
  const data = await res.json()
  if (!data.success) return <p>No data found</p>
  const products = data.payload
  return (
    <div className='w-full flex flex-col items-center justify-center p-4 gap-4 bg-blue-50 '>
      <h1 className='text-3xl text-center '>Latest Products</h1>
      {
        products && <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {
            products.map((item) => (
              <Link href={`/menu/${item.slug}`} key={item._id} className=''>
                <Item item={item} />
              </Link>
            ))
          }
        </div>
      }
    </div>
  )
}

export default Latest
